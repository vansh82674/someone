import { Server, Socket } from 'socket.io'
import { redis } from '../config/redis.js'

// Simple keyword filter for Sprint 3
const BANNED_WORDS = ['hate', 'kill', 'suicide', 'slur1', 'slur2']; // Mock list
const isClean = (text: string) => {
    const lowerText = text.toLowerCase();
    return !BANNED_WORDS.some(word => lowerText.includes(word));
};

export const handleSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log("Connected:", socket.id)

        // Sprint 2: Topic-Based Matchmaking
        socket.on("join_queue", async (data) => {
            const topic = data.topic || "casual";
            const queueKey = `waiting_queue_${topic}`;
            
            console.log(`User ${socket.id} wants to join the queue for topic: ${topic}`)

            // 1. Try to get someone from the topic queue
            const partnerSocketId = await redis.rpop(queueKey)

            if (partnerSocketId && partnerSocketId !== socket.id) {
                // 2. Check if they are still connected  
                const partnerSocket = io.sockets.sockets.get(partnerSocketId)

                if (partnerSocket) {
                    // 3. Success They are connected 
                    const roomName = `room_${Date.now()}_${socket.id}`

                    // save the roomname for disconnecting
                    socket.data.room = roomName;
                    partnerSocket.data.room = roomName;

                    // Make sure they both are connected to the room
                    socket.join(roomName)
                    partnerSocket.join(roomName)

                    // emit 'matched'
                    return io.to(roomName).emit("matched", {
                        room: roomName,
                        topic: topic
                    })
                }
            }
            
            // 4. Fallback: If empty, push current socket to topic queue
            await redis.lpush(queueKey, socket.id)
            socket.emit("waiting_queue", { message: "Waiting for a partner", topic })
        })

        // Cancel Queueing
        socket.on("leave_queue", async (data) => {
            const topic = data.topic || "casual";
            const queueKey = `waiting_queue_${topic}`;
            await redis.lrem(queueKey, 0, socket.id);
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