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