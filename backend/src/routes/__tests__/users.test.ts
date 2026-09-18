import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import usersRouter from '../users.js';
import { prisma } from '../../config/prisma.js';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    }
  }
}));

const prismaMock = prisma;

describe('Users Routes (Integration & Unit)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/users/listeners', () => {
        it('should return a list of verified listeners', async () => {
            const mockListeners = [
                {
                    id: 1,
                    name: "Dr. Yagbal Kapil",
                    anonId: "anon-YK001",
                    tagline: "Mindful Listener",
                    rating: 4.9,
                    reviewsCount: 128,
                    quote: "Calm listener",
                    topics: ["Relationships"],
                    price: "₹199 / 60m",
                    bgColor: "bg-[#7C3AED]"
                }
            ];

            prismaMock.user.findMany.mockResolvedValue(mockListeners);

            const res = await request(app).get('/api/users/listeners');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockListeners);
            expect(prismaMock.user.findMany).toHaveBeenCalledWith({
                where: { role: 'LISTENER', isVerified: true },
                select: expect.any(Object),
                orderBy: { rating: 'desc' }
            });
        });

        it('should handle internal server errors gracefully', async () => {
            prismaMock.user.findMany.mockRejectedValue(new Error('DB connection lost'));

            const res = await request(app).get('/api/users/listeners');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('POST /api/users/apply-listener', () => {
        it('should return 400 if email is missing', async () => {
            const res = await request(app).post('/api/users/apply-listener').send({
                tagline: "Test",
            });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Email is required" });
        });

        it('should return 404 if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const res = await request(app).post('/api/users/apply-listener').send({
                email: "test@example.com",
            });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: "User not found" });
        });

        it('should update user to LISTENER role and return success', async () => {
            const mockUser = { id: 1, email: "test@example.com" };
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const updatedUser = { ...mockUser, role: 'LISTENER', isVerified: false };
            prismaMock.user.update.mockResolvedValue(updatedUser);

            const payload = {
                email: "test@example.com",
                tagline: "Listener",
                quote: "Here to listen",
                topics: ["Life"],
                price: "₹199 / 60m",
                bgColor: "bg-black"
            };

            const res = await request(app).post('/api/users/apply-listener').send(payload);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: "Application submitted successfully",
                user: updatedUser
            });
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { email: payload.email },
                data: expect.objectContaining({
                    role: 'LISTENER',
                    isVerified: false,
                    tagline: payload.tagline,
                })
            });
        });
    });
});
