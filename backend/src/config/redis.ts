
import { Redis } from 'ioredis'

// Initialise Redis
export const redis = new Redis(process.env.REDIS_URL || "")
redis.on("connect", () => {
    console.log("Connected to Redis Successfully")
})
redis.on("error", (err) => {
    console.error("Redus connection failed:", err.message)
})
