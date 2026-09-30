import { Server, Socket } from 'socket.io'
import { redis } from '../config/redis.js'
import { prisma } from '../config/prisma.js'

// Simple keyword filter for Sprint 3
const BANNED_WORDS = ['hate', 'kill', 'suicide', 'slur1', 'slur2']; // Mock list
const isClean = (text: string) => {
    const lowerText = text.toLowerCase();
    return !BANNED_WORDS.some(word => lowerText.includes(word));
};

const endSession = async (roomName: string) => {
    const sessionStr = await redis.get(`session:${roomName}`);
    if (sessionStr) {
        await redis.del(`session:${roomName}`);
        const session = JSON.parse(sessionStr);
        const durationMins = (Date.now() - session.startTime) / 60000;
        const deduction = Math.ceil((session.listenerRate / 60) * durationMins);
        
        if (deduction > 0) {
            try {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: session.userId },
                        data: { walletBalance: { decrement: deduction } }
                    }),
                    prisma.user.update({
                        where: { id: session.listenerId },
                        data: { walletBalance: { increment: Math.floor(deduction * 0.8) } }
                    }),
                    prisma.transaction.create({
                        data: { userId: session.userId, amount: -deduction, type: 'CHAT_DEDUCTION', status: 'SUCCESS' }
                    }),
                    prisma.transaction.create({
                        data: { userId: session.listenerId, amount: Math.floor(deduction * 0.8), type: 'CHAT_EARNING', status: 'SUCCESS' }
                    })
                ]);
            } catch (error) {
                console.error("Payment deduction failed:", error);
            }
        }
    }
};

export const handleSockets = (io: Server) => {
    // auth middleware
    io.use(async (socket, next) => {
        // get user id
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error('Authentication error: No userId provided'))
        }

        try {
            // find the user in DB
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                }
            })

            if (!user) return next(new Error("User not found"))

            socket.data.userId = user.id;
            socket.data.role = user.role;
            socket.data.isVerified = user.isVerified;
            socket.data.topics = user.topics;
            socket.data.hourlyRate = user.hourlyRate;
            socket.data.walletBalance = user.walletBalance;

            next();
        }
        catch (error) {
            next(new Error("Internal Server Error"))
        }
    })
    io.on('connection', (socket: Socket) => {
        console.log("Connected:", socket.id)

        // Sprint 2: Topic-Based Matchmaking
        socket.on("join_queue", async (data) => {
            const isListener = socket.data.role === 'LISTENER' && socket.data.isVerified === true;
            const userTopic = data.topic || "casual";

            if (isListener) {
                const topics = socket.data.topics && socket.data.topics.length > 0 ? socket.data.topics : ["casual"];

                // 1. Loop through all topics to find a waiting USER
                let matched = false;
                for (const topic of topics) {
                    const queueLen = await redis.llen('waiting_users_' + topic);
                    for (let i = 0; i < queueLen; i++) {
                        const partnerSocketId = await redis.rpop('waiting_users_' + topic);
                        if (!partnerSocketId) break;

                        if (partnerSocketId !== socket.id) {
                            const partnerSocket = io.sockets.sockets.get(partnerSocketId);

                            if (partnerSocket && !partnerSocket.data.room) {
                                // Check if user has enough balance for this listener
                                if ((partnerSocket.data.walletBalance || 0) >= (socket.data.hourlyRate || 199)) {
                                    const roomName = `room_${Date.now()}_${socket.id}`;
                                    socket.data.room = roomName;
                                    partnerSocket.data.room = roomName;
                                    socket.join(roomName);
                                    partnerSocket.join(roomName);

                                    await redis.set(`session:${roomName}`, JSON.stringify({
                                        userId: partnerSocket.data.userId,
                                        listenerId: socket.data.userId,
                                        listenerRate: socket.data.hourlyRate || 199,
                                        startTime: Date.now()
                                    }));

                                    io.to(roomName).emit("matched", { room: roomName, topic });
                                    matched = true;
                                    break;
                                } else {
                                    await redis.lpush('waiting_users_' + topic, partnerSocketId);
                                }
                            }
                        }
                    }
                    if (matched) return;
                }

                // 2. Fallback: No users found. Push listener into ALL their topic queues
                for (const topic of topics) {
                    await redis.lpush('waiting_listeners_' + topic, socket.id);
                }
                socket.emit("waiting_queue", { message: "Waiting for a user", topics });

            } else {
                // THIS IS A NORMAL USER

                // 1. Check if there is a LISTENER waiting in this topic
                let matched = false;
                const queueLen = await redis.llen('waiting_listeners_' + userTopic);
                for (let i = 0; i < queueLen; i++) {
                    const partnerSocketId = await redis.rpop('waiting_listeners_' + userTopic);
                    if (!partnerSocketId) break;

                    if (partnerSocketId !== socket.id) {
                        const partnerSocket = io.sockets.sockets.get(partnerSocketId);

                        if (partnerSocket && !partnerSocket.data.room) {
                            if ((socket.data.walletBalance || 0) >= (partnerSocket.data.hourlyRate || 199)) {
                                const roomName = `room_${Date.now()}_${socket.id}`;
                                socket.data.room = roomName;
                                partnerSocket.data.room = roomName;
                                socket.join(roomName);
                                partnerSocket.join(roomName);

                                await redis.set(`session:${roomName}`, JSON.stringify({
                                    userId: socket.data.userId,
                                    listenerId: partnerSocket.data.userId,
                                    listenerRate: partnerSocket.data.hourlyRate || 199,
                                    startTime: Date.now()
                                }));

                                io.to(roomName).emit("matched", { room: roomName, topic: userTopic });
                                matched = true;
                                break;
                            } else {
                                await redis.lpush('waiting_listeners_' + userTopic, partnerSocketId);
                            }
                        }
                    }
                }
                if (matched) return;

                // 2. Fallback: No listeners found. Push user into waiting_users queue
                await redis.lpush('waiting_users_' + userTopic, socket.id);
                socket.emit("waiting_queue", { message: "Waiting for a listener", topic: userTopic });
            }
        });

        // Cancel Queueing
        socket.on("leave_queue", async (data) => {
            const isListener = socket.data.role === 'LISTENER' && socket.data.isVerified === true;
            
            if (isListener) {
                const topics = socket.data.topics && socket.data.topics.length > 0 ? socket.data.topics : ["casual"];
                for (const topic of topics) {
                    await redis.lrem(`waiting_listeners_${topic}`, 0, socket.id);
                }
            } else {
                const topic = data.topic || "casual";
                await redis.lrem(`waiting_users_${topic}`, 0, socket.id);
            }
        });

        // broadcast data into that room only
        socket.on("send_message", (data) => {
            // Sprint 3: Trust & Safety filtering
            if (data.text && !isClean(data.text)) {
                // Block the message and warn the sender
                return socket.emit("message_blocked", { error: "Message contains restricted keywords." });
            }
            // data should contain {text, senderId, room}
            socket.to(data.room).emit("new_message", data)
        })

        // when user wants to leave chat
        socket.on("leave_room", async (data) => {
            // tell the other person they left
            socket.to(data.room).emit("stranger_disconnected")
            
            await endSession(data.room);

            // remove the socket from the room
            socket.leave(data.room)
            socket.data.room = null;
        })

        socket.on('typing', (data) => {
            socket.to(data.room).emit('typing')
        })

        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('stop_typing')
        })

        // Cleanup the socket
        socket.on('disconnect', async () => {
            if (socket.data.room) {
                socket.to(socket.data.room).emit('stranger_disconnected', { id: socket.id })
                await endSession(socket.data.room);
            }
            // If they were in any queue, we don't know the topic easily without tracking it, 
            // but lrem is fast enough if we check common ones, or we just let it be a ghost.
            // For now, let it be a ghost. Our rpop handles disconnected ghosts gracefully.
        })
    })
}