import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors()) // Allow frontend to talk with backend without errors

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Allow nextjs frontend
        methods: ['GET', "POST"]
    }
})

// Listen for WebSockets
io.on('connection', (socket) => {
    console.log("User connected:", socket.id)

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id)
    })
})

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("Someone backend is running");
})

// Listening to PORT
httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})