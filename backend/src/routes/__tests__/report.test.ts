import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import reportRouter from '../report.js';
import { prisma } from '../../config/prisma.js';

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    moderationEvent: {
      create: vi.fn(),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api/report', reportRouter);

describe('Report Routes (Integration & Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/report', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/report').send({ sessionId: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('sessionId, reporterId, and reason are required');
    });

    it('should successfully create a moderation event', async () => {
      const mockReport = { id: 'rep-1', sessionId: 'sess-1', reporterId: 5, reason: 'harassment', timestamp: new Date() };
      vi.mocked(prisma.moderationEvent.create).mockResolvedValueOnce(mockReport as any);

      const res = await request(app).post('/api/report').send({
        sessionId: 'sess-1',
        reporterId: 5,
        reason: 'harassment'
      });

      expect(res.status).toBe(201);
      // dates are serialized to strings in JSON
      expect(res.body.id).toBe('rep-1');
      expect(res.body.sessionId).toBe('sess-1');
      
      expect(prisma.moderationEvent.create).toHaveBeenCalledWith({
        data: {
          sessionId: 'sess-1',
          reporterId: 5,
          reason: 'harassment'
        }
      });
    });

    it('should handle internal server errors gracefully', async () => {
      vi.mocked(prisma.moderationEvent.create).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app).post('/api/report').send({
        sessionId: 'sess-1',
        reporterId: 5,
        reason: 'harassment'
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });
});
