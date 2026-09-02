'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";



export default function Home() {
  // Default idle Status
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-4xl font-bold">SOMEONE</h1>
      <Button className='bg-brand-violet text-white font-sans' >
        <Link href='/queue'>Start Chatting.....</Link>
      </Button>
    </div>

  );
}
