import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import authRouter from '../auth.js';
import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcryptjs';

vi.mock('../../config/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    }
  }
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes (Integration & Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/signup').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email, password, and name are required');
    });

    it('should return 400 if user already exists', async () => {
      // Mock existing user
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 1, email: 'test@test.com' } as any);

      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should successfully create a new user', async () => {
      // Find user (by email) returns null
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      // Find anonId returns null
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      
      vi.mocked(bcrypt.hash).mockResolvedValueOnce('hashed_password' as never);

      const mockUser = {
        id: 1,
        email: 'new@test.com',
        name: 'New User',
        anonId: 'anon-1234',
        password: 'hashed_password'
      };

      vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser as any);

      const res = await request(app).post('/api/auth/signup').send({
        email: 'new@test.com',
        password: 'password123',
        name: 'New User'
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 1,
        email: 'new@test.com',
        name: 'New User',
        anonId: 'anon-1234'
      });
      
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'a@a.com' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      const res = await request(app).post('/api/auth/login').send({ email: 'no@test.com', password: 'pw' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 400 if password does not match', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 1, password: 'hash' } as any);
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);

      const res = await request(app).post('/api/auth/login').send({ email: 'user@test.com', password: 'wrong_pw' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 200 and user object if successful', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ 
        id: 1, 
        email: 'user@test.com', 
        name: 'User', 
        anonId: 'anon1', 
        password: 'hash' 
      } as any);
      
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);

      const res = await request(app).post('/api/auth/login').send({ email: 'user@test.com', password: 'correct_pw' });
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        email: 'user@test.com',
        name: 'User',
        anonId: 'anon1'
      });
    });
  });
});
