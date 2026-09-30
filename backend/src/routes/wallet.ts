import { Router } from "express";
import { prisma } from "../config/prisma.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret'
});

router.post("/create-order", async (req, res) => {
    const { amount, userId } = req.body;
    
    if (!amount || !userId) {
        return res.status(400).json({ error: "Amount and UserId are required" });
    }

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.status(200).json(order);
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'mock_secret');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
        try {
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: parseInt(userId) },
                    data: { walletBalance: { increment: amount } }
                }),
                prisma.transaction.create({
                    data: {
                        userId: parseInt(userId),
                        amount: amount,
                        type: 'CREDIT_ADD',
                        status: 'SUCCESS',
                        referenceId: razorpay_payment_id
                    }
                })
            ]);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Verification DB update failed:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
    }
});

export default router;
