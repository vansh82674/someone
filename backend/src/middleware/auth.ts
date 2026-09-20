import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // In a fully secure production app, you would pass the NextAuth JWT
        // in the Authorization header and verify it using the NEXTAUTH_SECRET here.
        // For now, we'll look for a custom header passed by the frontend.
        const userIdHeader = req.headers['x-user-id'];

        if (!userIdHeader || Array.isArray(userIdHeader)) {
            return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
        }

        const userId = parseInt(userIdHeader);

        if (isNaN(userId)) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user ID' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isAdmin: true }
        });

        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        // Add user info to request for subsequent handlers if needed
        (req as any).adminId = userId;
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
