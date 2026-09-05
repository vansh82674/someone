'use client'
import { Button } from "@/components/ui/button"
import { useSocket } from "@/components/ui/SocketProvider"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { motion } from 'framer-motion'
import { Send } from "lucide-react";


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
    // States for typing indicator and ref for the debounce timer
    const [isStrangerTyping, setIsStrangerTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

        // Listen for typing events
        socket?.on('typing', () => setIsStrangerTyping(true))
        socket?.on('stop_typing', () => setIsStrangerTyping(false))

        // cleanup the listeners
        return () => {
            socket?.off('new_message');
            socket?.off('stranger_disconnected');
            socket?.off('typing');
            socket?.off('stop_typing');
        }


    }, [socket, roomId])

    // Auto-scroll to the bottom whenever messages or typing state changes
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStrangerTyping]);

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

        // We sent a message, so force stop typing immediately
        socket?.emit('stop_typing', { room: roomId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setInputValue("")
    }

    // intentionally want to leave chat 
    const leaveChat = () => {
        // escape hatch conformation
        if (window.confirm("Are you sure you want to end this session?")) {
            socket?.emit("leave_room", { room: roomId })
            setMessages([])
            router.push('/')
        }
    }

    // Handle typing with debouncing
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        // Tell the stranger we are typing
        socket?.emit('typing', { room: roomId });

        // Clear the old timer if it exists
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Start a new 1.5s timer. If we don't type again in 1.5s, emit stop_typing
        typingTimeoutRef.current = setTimeout(() => {
            socket?.emit('stop_typing', { room: roomId });
        }, 1500);
    }

    return (
        <div className="flex flex-col h-dvh bg-brand-cream font-sans relative overflow-hidden">

            {/* Header - Glassmorphism */}
            <div className="absolute top-0 inset-x-0 z-10 bg-brand-cream/80 backdrop-blur-md border-b border-brand-violet/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <span className="font-heading font-bold text-brand-dark text-lg tracking-tight">Stranger</span>
                </div>
                <Button
                    variant='default'
                    onClick={leaveChat}
                    className="text-red-600 bg-red-50 hover:bg-red-50 hover:scale-105 rounded-full px-4 font-semibold transition-colors"
                >
                    Leave Chat
                </Button>
            </div>

            {/* The Messages Area */}
            <div className="flex-1 overflow-y-auto pt-24 pb-40 px-4 md:px-12 xl:px-32 space-y-6">
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === socket?.id;
                    const isSystem = msg.senderId === 'system';

                    if (isSystem) {
                        return (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-6">
                                <span className="text-[11px] font-bold tracking-widest text-brand-dark/30 uppercase bg-black/5 px-3 py-1 rounded-full">
                                    {msg.text}
                                </span>
                            </motion.div>
                        )
                    }

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] md:max-w-[60%] wrap-break-word px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${isMe
                                ? 'bg-brand-violet text-white rounded-[24px] rounded-br-lg shadow-brand-violet/20'
                                : 'bg-white text-brand-dark rounded-[24px] rounded-bl-lg border border-gray-100'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    )
                })}

                {/* Animated Typing Indicator */}
                {isStrangerTyping && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-[24px] rounded-bl-lg shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}

                {/* The invisible div we scroll to */}
                <div ref={messageEndRef} />
            </div>

            {/* The Input Area */}
            <div
                className="absolute bottom-0 inset-x-0 bg-linear-to-t from-brand-cream via-brand-cream to-transparent pt-12 px-4 md:px-12 xl:px-32 pointer-events-none"
                style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
                <div className="relative flex items-center bg-white rounded-full shadow-lg shadow-black/5 border border-gray-200/60 p-2 pointer-events-auto">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 min-w-0 bg-transparent px-4 py-2 focus:outline-none placeholder:text-brand-dark/40"
                        value={inputValue}
                        onChange={handleTyping}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!inputValue.trim()}
                        className={`rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all ${inputValue.trim()
                            ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/20 hover:scale-105'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    )

}