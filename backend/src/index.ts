import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv'
import { handleSockets } from './sockets/socketHandler.js';

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
// Pass the io instance to handler
handleSockets(io)

const PORT = process.env.PORT || 8081;

app.get('/', (req, res) => {
    res.send("Someone backend is running");
})

// Listening to PORT
httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})