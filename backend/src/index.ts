import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis'
import dotenv from 'dotenv'


dotenv.config()

const app = express();
app.use(cors()) // Allow frontend to talk with backend without errors

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Allow nextjs frontend
        methods: ['GET', "POST"]
    }
})

// Initialise Redis
const redis = new Redis(process.env.REDIS_URL || "")
redis.on("connect", () => {
    console.log("Connected to Redis Successfully")
})
redis.on("error", (err) => {
    console.error("Redus connection failed:", err.message)
})

// Initialise Prisma
const prisma = new PrismaClient()
async function testPrisma() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('Connected to Supabase (via Prisma) successfully')
    }
    catch (error) {
        console.error("Prisma Connection failed", error)
    }
}
testPrisma()

// Listen for WebSockets
io.on('connection', (socket) => {
    console.log("User connected:", socket.id)

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



    // Cleanup the socket
    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id)
    })
})

const PORT = process.env.PORT || 8081;

app.get('/', (req, res) => {
    res.send("Someone backend is running");
})

// Listening to PORT
httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})