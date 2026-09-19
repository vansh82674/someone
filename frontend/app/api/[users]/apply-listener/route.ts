import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from 'zod'
import axios, { isAxiosError } from 'axios'

const formSchema = z.object({
    tagline: z.string().nonempty(),
    quote: z.string().nonempty(),
    topics: z.array(z.string()),
    price: z.string(),
    bgColor: z.string().optional()
})

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401, })
    }

    const formData = await req.json();

    try {
        formSchema.parse(formData)
        const response = await axios.post(
            `${backendUrl}/api/users/apply-listener`,
            {
                ...formData,
                email: session.user.email
            }
        )
        return NextResponse.json(response.data, { status: 200 })
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Validation error", issues: error.issues }, { status: 400 });
        }

        if (isAxiosError(error)) {
            return NextResponse.json(
                { message: error.response?.data?.message || "Backend error" },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}