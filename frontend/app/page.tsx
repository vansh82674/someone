'use client'
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
export default function Home() {

  useEffect(() => {
    // Dial the backend
    const socket = io('http://localhost:8080')

    socket.on('connect', () => {
      console.log("Successfully connected to backend!")
    })


    // Cleanup connnection when the user leaves page
    return () => {
      socket.disconnect()
    }

  }, [])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-4xl font-bold">SOMEONE</h1>
      <Button className='bg-brand-violet text-white font-sans'>Start Chatting</Button>
    </div>

  );
}
