import { Router } from 'express';
// @ts-check - Triggering TS language server refresh
import { prisma } from '../config/prisma.js';

const router = Router();

// Get past sessions for a user
router.get('/past/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const sessions = await prisma.sessionLog.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        res.status(200).json(sessions);

    } catch (error) {
        console.error('Fetch sessions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save a new session log
router.post('/', async (req, res) => {
    try {
        const { userId, partnerAnonId, durationSeconds, topic, endedBy } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const session = await prisma.sessionLog.create({
            data: {
                userId,
                partnerAnonId,
                durationSeconds: durationSeconds || 0,
                topic,
                endedBy: endedBy || 'SYSTEM'
            }
        });

        res.status(201).json(session);
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
