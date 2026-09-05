import { PrismaClient } from '@prisma/client';

// Initialise Prisma
export const prisma = new PrismaClient()
async function testPrisma() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('Connected to Supabase (via Prisma) successfully')
    }
    catch (error) {
        console.error("Prisma Connection failed", error)
    }
}
testPrisma()