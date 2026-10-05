import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import walletRouter from '../wallet.js';
import { prisma } from '../../config/prisma.js';
import crypto from 'crypto';

// Mock Razorpay
vi.mock('razorpay', () => {
  return {
    default: class {
      orders = {
        create: vi.fn().mockImplementation((options) => {
          if (options.amount <= 0) {
            return Promise.reject(new Error("Amount must be positive"));
          }
          return Promise.resolve({
            id: 'order_mock123',
            entity: 'order',
            amount: options.amount,
            currency: 'INR',
            receipt: 'receipt_mock'
          });
        }),
        fetch: vi.fn().mockResolvedValue({
          id: 'order_mock123',
          entity: 'order',
          amount: 50000, // 500 INR in paise
          currency: 'INR',
          receipt: 'receipt_mock',
          status: 'paid'
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

describe('Wallet Routes (Production Grade)', () => {
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

    it('should return 400 if amount is negative or zero (User Randomness/Security)', async () => {
      const resZero = await request(app)
        .post('/api/wallet/create-order')
        .send({ amount: 0, userId: 1 });
      
      expect(resZero.status).toBe(400);
      expect(resZero.body.error).toBe('Invalid amount');

      const resNegative = await request(app)
        .post('/api/wallet/create-order')
        .send({ amount: -500, userId: 1 });

      expect(resNegative.status).toBe(400);
      expect(resNegative.body.error).toBe('Invalid amount');
    });

    it('should return a created order successfully for valid positive amount', async () => {
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
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should successfully verify payment and add credits securely', async () => {
      const orderId = 'order_mock123';
      const paymentId = 'pay_mock123';
      const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      const res = await request(app)
        .post('/api/wallet/verify-payment')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: expectedSignature,
          userId: 1,
          amount: 500
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should reject payment verification if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/wallet/verify-payment')
        .send({
          razorpay_order_id: 'order_mock123',
          razorpay_payment_id: 'pay_mock123',
          // missing signature, amount, userId
        });

      expect(res.status).toBe(400);
    });
  });
});
