import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import sessionsRouter from '../sessions.js';
import { prisma } from '../../config/prisma.js';

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    sessionLog: {
      findMany: vi.fn(),
      create: vi.fn(),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api/sessions', sessionsRouter);

describe('Sessions Routes (Integration & Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/sessions/past/:userId', () => {
    it('should return 400 for invalid userId', async () => {
      const res = await request(app).get('/api/sessions/past/invalid_id');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user ID');
    });

    it('should fetch and return past sessions for valid user', async () => {
      const mockSessions = [
        { id: '1', userId: 1, topic: 'casual', durationSeconds: 600, createdAt: new Date() }
      ];
      vi.mocked(prisma.sessionLog.findMany).mockResolvedValueOnce(mockSessions as any);

      const res = await request(app).get('/api/sessions/past/1');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].topic).toBe('casual');
      expect(prisma.sessionLog.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
    });

    it('should handle internal server errors gracefully', async () => {
      vi.mocked(prisma.sessionLog.findMany).mockRejectedValueOnce(new Error('DB connection lost'));
      
      const res = await request(app).get('/api/sessions/past/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('POST /api/sessions', () => {
    it('should return 400 if userId is missing', async () => {
      const res = await request(app).post('/api/sessions').send({ topic: 'career' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('userId is required');
    });

    it('should successfully create a session log', async () => {
      const mockSession = { id: 'uuid-123', userId: 1, topic: 'career' };
      vi.mocked(prisma.sessionLog.create).mockResolvedValueOnce(mockSession as any);

      const res = await request(app).post('/api/sessions').send({
        userId: 1,
        partnerAnonId: 'anon-abc',
        durationSeconds: 1200,
        topic: 'career',
        endedBy: 'USER'
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockSession);
      expect(prisma.sessionLog.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          partnerAnonId: 'anon-abc',
          durationSeconds: 1200,
          topic: 'career',
          endedBy: 'USER'
        }
      });
    });
  });
});
