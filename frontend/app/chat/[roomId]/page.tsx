'use client'
import { Button } from "@/components/ui/button"
import { useSocket } from "@/components/ui/SocketProvider"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { motion } from 'framer-motion'


type Message = {
    text: string,
    senderId: string,
    room: string
}

export default function ChatRoom() {

    // get the socket connecteds
    const { socket } = useSocket();
    const params = useParams();
    const router = useRouter()

    // get the room id from params
    const roomId = String(params.roomId);

    // message array for displaying messages on UI
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    // for auto scrolling to the bottom purpose
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        // for listening the new message
        socket?.on('new_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })

        // for stranger disconnects
        socket?.on('stranger_disconnected', (data) => {
            setMessages((prev) => [...prev, { text: "Stranger has disconnected.", senderId: "system", room: roomId }]);
        })

        return () => {
            socket?.off('new_message');
            socket?.off('stranger_disconnected');
        }


    }, [])

    // send message function
    const sendMessage = () => {
        const newMsg = {
            text: inputValue,
            senderId: socket?.id || "unknown",
            room: roomId
        }
        // show it on user screen
        setMessages((prev) => [...prev, newMsg])
        socket?.emit("send_message", { ...newMsg, room: roomId })
        setInputValue("")
    }

    // intentionally want to leave chat 
    const leaveChat = () => {
        socket?.emit("leave_room", { room: roomId })
        setMessages([])
        router.push('/')
    }
    return (<div className="flex flex-col h-screen bg-brand-cream font-sans">

        {
            // THE WRAPPER: 100% height, flex column, background color 
        }
        {
            // Header Fixed at the top 
        }
        <div className="p-4 border-b border-gray-300 bg-white">
            <Button onClick={leaveChat}>Leave Chat</Button>
        </div>

        {
            // The messages area 
        }
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {
                messages.map((msg, i) => {
                    // 1. Determine who sent the message
                    const isMe = msg.senderId === socket?.id;
                    const isSystem = msg.senderId === 'system';
                    return (
                        // 2. THE WRAPPER: Use flexbox to align left, right, or center based on who sent it
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} // Start invisible and pushed down 20px
                            animate={{ opacity: 1, y: 0 }}  // Animate to fully visible and original position
                            transition={{ duration: 0.3 }}  // Take 0.3 seconds to do it
                            className={`flex w-full ${isSystem ? 'justify-center' : isMe ? 'justify-end' : 'justify-start'
                                }`}>

                            {/* 3. THE BUBBLE: Add padding, rounded corners, and dynamic colors */}
                            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm md:text-base ${isSystem
                                ? 'text-gray-500 text-xs italic bg-transparent'
                                : isMe
                                    ? 'bg-brand-violet text-white rounded-br-none'
                                    : 'bg-gray-200 text-brand-dark rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>

                        </motion.div>
                    )
                })}
        </div>

        {
            // The input area
        }

        < div className="p-4 bg-white border-t border-gray-300 flex gap-2" >
            <input type="text" className="flex-1 border rounded-lg px-4 py-2" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Button className='text-xl' onClick={sendMessage} >Send Message</Button>
        </div >
    </div >
    )
}