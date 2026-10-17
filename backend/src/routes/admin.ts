import { Router } from "express";
import { prisma } from '../config/prisma.js';
import { isAdminMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply middleware to all admin routes
router.use(isAdminMiddleware);

router.get('/pending-listeners', async (req, res) => {

    try {
        const totalUsers = await prisma.user.count();

        const pendingUsers = await prisma.user.findMany({
            where: {
                role: "LISTENER",
                isVerified: false,
                isAdmin: false
            }
        })

        const totalListeners = await prisma.user.count({
            where: {
                role: "LISTENER",
                isVerified: true,
                isAdmin: false
            }
        })

        return res.status(200).json({ totalUsers, pendingUsers, totalListeners })
    }
    catch (error) {
        console.error('admin error', error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post('/verify-listener', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const verifiedUser = await prisma.user.update({
            where: { email },
            data: { isVerified: true }
        })

        res.status(200).json(verifiedUser)
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Errors" })
    }
})

router.post('/reject-listener', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Reset role to USER and remove listener flags
        const rejectedUser = await prisma.user.update({
            where: { email },
            data: {
                role: "USER",
                isVerified: false,
                tagline: null,
                quote: null,
                topics: []
            }
        });

        res.status(200).json({ message: "Listener application rejected", user: rejectedUser });
    }
    catch (error) {
        console.error('reject-listener error', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                anonId: true,
                role: true,
                isVerified: true,
                isAdmin: true,
                walletBalance: true,
                hourlyRate: true
            },
            orderBy: { id: 'desc' }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('admin users error', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const reports = await prisma.moderationEvent.findMany({
            orderBy: { timestamp: 'desc' }
        });

        res.status(200).json(reports);
    } catch (error) {
        console.error('admin reports error', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;