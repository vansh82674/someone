import { Router } from 'express';
// @ts-check - Triggering TS language server refresh
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

const router = Router();

// Helper to generate a random anon ID (e.g., anon-7832)
const generateAnonId = () => `anon-${Math.floor(1000 + Math.random() * 9000)}`;

router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        let anonId = generateAnonId();

        // Ensure anonId is unique (simple retry logic)
        while (await prisma.user.findUnique({ where: { anonId } })) {
            anonId = generateAnonId();
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                anonId
            }
        });

        // Return user without password
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            anonId: user.anonId,
            role: user.role,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user without password
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            anonId: user.anonId,
            role: user.role,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
