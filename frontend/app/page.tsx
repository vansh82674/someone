'use client'
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
export default function Home() {
  // Store the socket connectioin in a red so our button can use it
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Dial the backend
    socketRef.current = io('http://localhost:8081')

    socketRef.current.on('connect', () => {
      console.log("Successfully connected to backend!")
    })

    // Listen for the backend's reply
    socketRef.current.on("queue_joined", (data) => {
      alert(data.message) // should pop up "You are officially in the queue"
    })

    // Cleanup connnection when the user leaves page
    return () => {
      socketRef.current?.disconnect()
    }

  }, [])


  const handleJoinQueue = () => {
    // Send the event to the backend
    socketRef.current?.emit("join_queue", { username: "Nexus" })
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-4xl font-bold">SOMEONE</h1>
      <Button className='bg-brand-violet text-white font-sans' onClick={handleJoinQueue}>Start Chatting</Button>
    </div>

  );
}
