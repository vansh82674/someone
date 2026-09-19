import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { handleSockets } from './sockets/socketHandler.js';
import authRouter from './routes/auth.js';
import sessionsRouter from './routes/sessions.js';
import reportRouter from './routes/report.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js'

const app = express();
app.use(cors()) // Allow frontend to talk with backend without errors
app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/report', reportRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter)

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