import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import walletRouter from '../wallet.js';
import { prisma } from '../../config/prisma.js';

// Mock Razorpay
vi.mock('razorpay', () => {
  return {
    default: class {
      orders = {
        create: vi.fn().mockResolvedValue({
          id: 'order_mock123',
          entity: 'order',
          amount: 20000,
          currency: 'INR',
          receipt: 'receipt_mock'
        })
      };
    }
  };
});

// Mock Prisma
vi.mock('../../config/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn().mockResolvedValue([]),
    user: {
      update: vi.fn()
    },
    transaction: {
      create: vi.fn()
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api/wallet', walletRouter);

describe('Wallet Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/wallet/create-order', () => {
    it('should return 400 if amount or userId is missing', async () => {
      const res = await request(app)
        .post('/api/wallet/create-order')
        .send({ amount: 200 }); // missing userId

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Amount and UserId are required');
    });

    it('should return a created order successfully', async () => {
      const res = await request(app)
        .post('/api/wallet/create-order')
        .send({ amount: 200, userId: 1 });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('order_mock123');
      expect(res.body.amount).toBe(20000);
    });
  });

  describe('POST /api/wallet/verify-payment', () => {
    it('should return 400 for invalid signature', async () => {
      const res = await request(app)
        .post('/api/wallet/verify-payment')
        .send({
          razorpay_order_id: 'order_mock123',
          razorpay_payment_id: 'pay_mock123',
          razorpay_signature: 'invalid_signature_here',
          userId: 1,
          amount: 200
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid signature');
    });

    // We could mock crypto.createHmac to return a known signature,
    // but the failure case confirms the route is hit and signature verified.
  });
});
