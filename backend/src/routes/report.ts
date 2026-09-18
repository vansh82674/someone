import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { sessionId, reporterId, reason } = req.body;

        if (!sessionId || !reporterId || !reason) {
            return res.status(400).json({ error: 'sessionId, reporterId, and reason are required' });
        }

        const report = await prisma.moderationEvent.create({
            data: {
                sessionId,
                reporterId,
                reason
            }
        });

        res.status(201).json(report);
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
