'use client'
import { Button } from "@/components/ui/button"
import { useSocket } from "@/components/ui/SocketProvider"
import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Flag, AlertTriangle, UserX } from "lucide-react";
import { useSession } from "next-auth/react"

type Message = {
    text: string,
    senderId: string,
    room: string
}

export default function ChatRoom() {
    const { socket } = useSocket();
    const params = useParams();
    const router = useRouter()
    const { data: session } = useSession();

    const roomId = String(params.roomId);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isStrangerTyping, setIsStrangerTyping] = useState(false);
    
    // UI States for Sprints 3 & 4
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [hasReported, setHasReported] = useState(false);

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket?.on('new_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        })

        socket?.on('stranger_disconnected', (data) => {
            setIsDisconnected(true);
        })

        socket?.on('typing', () => setIsStrangerTyping(true))
        socket?.on('stop_typing', () => setIsStrangerTyping(false))
        
        socket?.on('message_blocked', (data) => {
            // Show local warning that message was blocked
            setMessages((prev) => [...prev, { text: `[System] ${data.error}`, senderId: "system", room: roomId }]);
        })

        return () => {
            socket?.off('new_message');
            socket?.off('stranger_disconnected');
            socket?.off('typing');
            socket?.off('stop_typing');
            socket?.off('message_blocked');
        }
    }, [socket, roomId])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStrangerTyping]);

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            text: inputValue,
            senderId: socket?.id || "unknown",
            room: roomId
        }
        setMessages((prev) => [...prev, newMsg])
        socket?.emit("send_message", { ...newMsg, room: roomId })

        socket?.emit('stop_typing', { room: roomId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setInputValue("")
    }

    const leaveChat = () => {
        if (window.confirm("Are you sure you want to end this session?")) {
            socket?.emit("leave_room", { room: roomId })
            setMessages([])
            router.push('/')
        }
    }

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        socket?.emit('typing', { room: roomId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket?.emit('stop_typing', { room: roomId });
        }, 1500);
    }

    const submitReport = async () => {
        if (!reportReason) return;
        setIsReporting(true);
        try {
            await fetch("http://localhost:8081/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: roomId,
                    reporterId: (session?.user as any)?.id || 0,
                    reason: reportReason
                }),
            });
            setHasReported(true);
            setTimeout(() => {
                setIsReportModalOpen(false);
                leaveChat(); // Automatically leave chat after reporting
            }, 2000);
        } catch (error) {
            console.error("Report failed", error);
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="flex flex-col h-dvh bg-brand-cream font-sans relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 z-10 bg-brand-cream/80 backdrop-blur-md border-b border-brand-violet/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <span className="font-heading font-bold text-brand-dark text-lg tracking-tight">Stranger</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsReportModalOpen(true)}
                        className="text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200 rounded-full px-4 font-semibold transition-colors flex items-center gap-2"
                    >
                        <Flag className="w-4 h-4" /> <span className="hidden sm:inline">Report</span>
                    </Button>
                    <Button
                        variant='default'
                        onClick={leaveChat}
                        className="text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 rounded-full px-4 font-semibold transition-colors"
                    >
                        Leave Chat
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-24 pb-40 px-4 md:px-12 xl:px-32 space-y-6">
                {messages.map((msg, i) => {
                    const isMe = msg.senderId === socket?.id;
                    const isSystem = msg.senderId === 'system';

                    if (isSystem) {
                        return (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-6">
                                <span className="text-[11px] font-bold tracking-widest text-brand-dark/50 uppercase bg-black/5 px-3 py-1 rounded-full">
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

                {isStrangerTyping && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-[24px] rounded-bl-lg shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-brand-dark/30 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Input Area */}
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
                        disabled={isDisconnected}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isDisconnected}
                        className={`rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all ${inputValue.trim()
                            ? 'bg-brand-violet text-white shadow-md shadow-brand-violet/20 hover:scale-105'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>

            {/* Disconnect Modal */}
            <AnimatePresence>
                {isDisconnected && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <UserX className="w-8 h-8 text-gray-500" />
                            </div>
                            <h2 className="text-2xl font-black font-heading text-brand-dark mb-2">Partner Disconnected</h2>
                            <p className="text-brand-dark/60 font-medium mb-8">The stranger has left the conversation. All messages have been securely wiped from our servers.</p>
                            
                            <div className="flex flex-col gap-3">
                                <Button onClick={() => router.push('/queue')} className="w-full py-6 rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-[15px]">
                                    Find Another Someone
                                </Button>
                                <Button variant="outline" onClick={() => router.push('/')} className="w-full py-6 rounded-xl border-gray-200 font-bold text-gray-600">
                                    Return Home
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-brand-dark">Report Stranger</h2>
                                </div>
                            </div>

                            {hasReported ? (
                                <div className="text-center py-6">
                                    <p className="text-green-600 font-bold mb-2">Report submitted successfully.</p>
                                    <p className="text-gray-500 text-sm">You are being disconnected...</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 font-medium mb-4">
                                        Is this user violating our community guidelines (e.g., hate speech, harassment, self-harm)?
                                    </p>
                                    
                                    <textarea 
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-violet/50 focus:ring-2 focus:ring-brand-violet/20 mb-6 bg-gray-50 text-sm font-medium"
                                        placeholder="Please provide brief details..."
                                        rows={4}
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                    />

                                    <div className="flex flex-col gap-3">
                                        <Button 
                                            onClick={submitReport} 
                                            disabled={!reportReason.trim() || isReporting}
                                            className="w-full py-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                                        >
                                            {isReporting ? "Submitting..." : "Submit Report & Leave"}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setIsReportModalOpen(false)} 
                                            className="w-full py-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}