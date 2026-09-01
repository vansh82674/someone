'use client'
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

// User status
type Status = 'idle' | 'waiting' | 'matched'
// Message
type Message = {
  text: string,
  senderId: string,
}


export default function Home() {

  // 1. for states of user status
  const [userStatus, setUserStatus] = useState<Status>("idle")

  // User message sent and recieved
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [roomName, setRoomName] = useState('')

  // Store the socket connectioin in a red so our button can use it
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Dial the backend
    socketRef.current = io('http://localhost:8081')

    socketRef.current.on('connect', () => {
      console.log("Successfully connected to backend!")
    })

    // Listen for the backend's reply
    // 2. Change user status
    socketRef.current.on("waiting_queue", (data) => {
      setUserStatus('waiting')
      console.log(data)
    })

    socketRef.current.on("matched", (data) => {
      // data is the roomname emitted from the backend
      setUserStatus('matched')
      setRoomName(data.room)
    })

    // new_message event listener
    socketRef.current.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    // Cleanup connnection when the user leaves page
    return () => {
      socketRef.current?.disconnect()
    }

  }, [])


  const handleJoinQueue = () => {
    // 3. Send the event to the backend
    socketRef.current?.emit("join_queue", { username: "Nexus" })
    setUserStatus('waiting')
  }

  const sendMessage = () => {
    const newMsg = {
      text: inputValue,
      senderId: socketRef.current?.id || "unknown"
    }

    // show it on user screen
    setMessages((prev) => [...prev, newMsg])
    socketRef.current?.emit("send_message", { ...newMsg, room: roomName })
    setInputValue("")
  }

  // 4. Conditional Rendering according to the user state
  if (userStatus === 'waiting') {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream text-brand-dark">
      <h1 className="text-2xl font-bold animate-pulse">Waiting for a partner.....</h1>
    </div>
  }

  if (userStatus === 'matched') {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream text-brand-dark">
      <h1 className="text-2xl font-bold text-green-500">You are in the chat room</h1>
      <div className="items-center justify-center text-brand-dark">
        {
          messages.map((msg, i) => (
            <li key={i} className={msg.senderId === socketRef.current?.id ? 'text-green-500' : 'text-gray-500'} >{msg.text}</li>
          ))
        }
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button className="bg-brand-violet text-white font-sans" onClick={sendMessage}>Send Message</Button>
      </div>
    </div>
  }

  // Default idle Status
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-4xl font-bold">SOMEONE</h1>
      <Button className='bg-brand-violet text-white font-sans' onClick={handleJoinQueue}>Start Chatting</Button>
    </div>

  );
}
