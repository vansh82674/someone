import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    console.log('Seeding Verified Listeners...');

    await prisma.user.upsert({
        where: { email: 'yagbal@example.com' },
        update: {},
        create: {
            email: 'yagbal@example.com',
            password,
            name: 'Dr. Yagbal Kapil',
            anonId: 'anon-YK001',
            role: 'LISTENER',
            isVerified: true,
            tagline: "Mindful Listener & Perspective Guide",
            rating: 4.9,
            reviewsCount: 128,
            quote: "Calm listener who enjoys helping people see situations from a different perspective.",
            topics: ["Relationships", "Life", "Personal Decisions"],
            price: "₹199 / 60m",
            bgColor: "bg-[#7C3AED]"
        }
    });

    await prisma.user.upsert({
        where: { email: 'vikas@example.com' },
        update: {},
        create: {
            email: 'vikas@example.com',
            password,
            name: 'Vikas Mishra',
            anonId: 'anon-VM002',
            role: 'LISTENER',
            isVerified: true,
            tagline: "Startup Operator & Decision Sounding Board",
            rating: 4.8,
            reviewsCount: 94,
            quote: "Startup enthusiast who enjoys helping people think through difficult decisions.",
            topics: ["Career", "Business", "Personal Decisions"],
            price: "₹199 / 60m",
            bgColor: "bg-[#1F2937]"
        }
    });

    await prisma.user.upsert({
        where: { email: 'pranjal@example.com' },
        update: {},
        create: {
            email: 'pranjal@example.com',
            password,
            name: 'Pranjal Dwivedi',
            anonId: 'anon-PD003',
            role: 'LISTENER',
            isVerified: true,
            tagline: "Peer Mentor & Academic Guidance",
            rating: 4.9,
            reviewsCount: 156,
            quote: "Management student with internship and interview experience.",
            topics: ["Studies", "Career", "Personal Decisions"],
            price: "₹199 / 60m",
            bgColor: "bg-[#059669]"
        }
    });

    console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
