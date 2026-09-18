import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

// GET /api/users/listeners
// Fetch all verified listeners for the homepage
router.get("/listeners", async (req, res) => {
    try {
        const listeners = await prisma.user.findMany({
            where: {
                role: 'LISTENER',
                isVerified: true
            },
            select: {
                id: true,
                name: true,
                anonId: true,
                tagline: true,
                rating: true,
                reviewsCount: true,
                quote: true,
                topics: true,
                price: true,
                bgColor: true,
            },
            orderBy: {
                rating: 'desc'
            }
        });
        res.status(200).json(listeners);
    } catch (error) {
        console.error("Failed to fetch listeners:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/users/apply-listener
// Apply to become a listener (update user role if authenticated)
router.post("/apply-listener", async (req, res) => {
    const { email, tagline, quote, topics, price, bgColor } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                role: 'LISTENER',
                isVerified: false, // Must be manually verified by admin later
                tagline: tagline || "Listener",
                quote: quote || "I'm here to listen.",
                topics: topics || [],
                price: price || "₹0 / 60m",
                bgColor: bgColor || "bg-[#7C3AED]"
            }
        });

        res.status(200).json({ message: "Application submitted successfully", user: updatedUser });
    } catch (error) {
        console.error("Failed to apply as listener:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
