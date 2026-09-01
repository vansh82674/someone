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

  // for auto scrolling the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // stranger disconnect 
    socketRef.current.on("stranger_disconnected", (data) => {
      setMessages((prev) => [...prev, { text: "Stranger has disconnected.", senderId: "system" }]);
    })

    // Cleanup connnection when the user leaves page
    return () => {
      socketRef.current?.disconnect()
    }

  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


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

  const leaveChat = () => {
    socketRef.current?.emit('leave_room', { room: roomName })
    setMessages([])
    setUserStatus('idle')
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
      <Button className="text-2xl bg-red-500 text-black" onClick={leaveChat}>Leave Chat</Button>
      <div className="w-full max-w-lg overflow-y-auto border rounded-xl p-4 items-center justify-center text-brand-dark">
        {
          messages.map((msg, i) => (
            <div key={i} className={`flex w-full mb-2 ${msg.senderId === 'system' ? 'justify-center' :
                msg.senderId === socketRef.current?.id ? 'justify-end' : 'justify-start'
              }`}>
              <div className={`px-4 py-2 rounded-2xl ${msg.senderId === 'system' ? 'bg-transparent text-red-500 italic' :
                  msg.senderId === socketRef.current?.id ? 'bg-brand-violet text-white' : 'bg-gray-200 text-black'
                }`}>
                {msg.text}
              </div>
            </div>
          ))
        }
        <div ref={messagesEndRef} />
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
