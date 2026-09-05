import { Server, Socket } from 'socket.io'
import { redis } from '../config/redis.js'

export const handleSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(socket.id)


        // Listen for the frontend
        socket.on("join_queue", async (data) => {
            console.log("User wants to join the queue:", data)

            // 1. Try to get someone from the queue
            const partnerSocketId = await redis.rpop("waiting_queue")

            if (partnerSocketId) {
                // 2. Someone was in the queue! Check if they are still connected  
                const partnerSocket = io.sockets.sockets.get(partnerSocketId)

                if (partnerSocket) {
                    // 3. Success They are connected 
                    // Create a new room
                    const roomName = `room_${Date.now()}_${socket.id}`

                    // save the roomname for disconnecting
                    socket.data.room = roomName;
                    partnerSocket.data.room = roomName;


                    // Make sure they both are connected to the room
                    socket.join(roomName)
                    partnerSocket.join(roomName)

                    // emit 'matched'
                    return io.to(roomName).emit("matched", {
                        room: roomName
                    })
                }
            }
            // 4.  Fallback: If we reach here, it means the queue was empty, 
            // or the person in the queue was a disconnected ghost 

            // push the current socket id back to redis waiting queue
            await redis.lpush('waiting_queue', socket.id)
            // emit a 'waiting' event just to the current socket 
            socket.emit("waiting_queue", { message: "Waiting for a partner" })

        })

        // broadcast data into that room only
        socket.on("send_message", (data) => {
            // data should contain {text, senderId, room}
            socket.to(data.room).emit("new_message", data)
        })

        // when user wants to leave chat
        socket.on("leave_room", (data) => {
            // tell the other person they left
            socket.to(data.room).emit("stranger_disconnected")
            // remove the socket from the room so they don't receive future messages
            socket.leave(data.room)
        })

        // broadcasting typing.. status to room
        socket.on('typing', (data) => {
            socket.to(data.room).emit('typing')
        })

        // emit stop typing
        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('stop_typing')
        })

        // Cleanup the socket
        socket.on('disconnect', () => {
            socket.to(socket.data.room).emit('stranger_disconnected', { id: socket.id })
        })
    })
}