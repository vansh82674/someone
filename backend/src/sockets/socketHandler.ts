import { Server, Socket } from 'socket.io'
import { redis } from '../config/redis.js'
import { prisma } from '../config/prisma.js'

// Simple keyword filter for Sprint 3
const BANNED_WORDS = ['hate', 'kill', 'suicide', 'slur1', 'slur2']; // Mock list
const isClean = (text: string) => {
    const lowerText = text.toLowerCase();
    return !BANNED_WORDS.some(word => lowerText.includes(word));
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
                for (const topic of topics) {
                    const partnerSocketId = await redis.rpop('waiting_users_' + topic);

                    if (partnerSocketId && partnerSocketId !== socket.id) {
                        const partnerSocket = io.sockets.sockets.get(partnerSocketId);

                        if (partnerSocket && !partnerSocket.data.room) {
                            const roomName = `room_${Date.now()}_${socket.id}`;
                            socket.data.room = roomName;
                            partnerSocket.data.room = roomName;
                            socket.join(roomName);
                            partnerSocket.join(roomName);

                            return io.to(roomName).emit("matched", { room: roomName, topic });
                        }
                    }
                }

                // 2. Fallback: No users found. Push listener into ALL their topic queues
                for (const topic of topics) {
                    await redis.lpush('waiting_listeners_' + topic, socket.id);
                }
                socket.emit("waiting_queue", { message: "Waiting for a user", topics });

            } else {
                // THIS IS A NORMAL USER

                // 1. Check if there is a LISTENER waiting in this topic
                const partnerSocketId = await redis.rpop('waiting_listeners_' + userTopic);

                if (partnerSocketId && partnerSocketId !== socket.id) {
                    const partnerSocket = io.sockets.sockets.get(partnerSocketId);

                    if (partnerSocket && !partnerSocket.data.room) {
                        const roomName = `room_${Date.now()}_${socket.id}`;
                        socket.data.room = roomName;
                        partnerSocket.data.room = roomName;
                        socket.join(roomName);
                        partnerSocket.join(roomName);

                        return io.to(roomName).emit("matched", { room: roomName, topic: userTopic });
                    }
                }

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
        socket.on("leave_room", (data) => {
            // tell the other person they left
            socket.to(data.room).emit("stranger_disconnected")
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
            }
            // If they were in any queue, we don't know the topic easily without tracking it, 
            // but lrem is fast enough if we check common ones, or we just let it be a ghost.
            // For now, let it be a ghost. Our rpop handles disconnected ghosts gracefully.
        })
    })
}