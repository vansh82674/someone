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

export default router;