'use client'
import { useState, useEffect } from "react";
import { useSocket } from "@/components/ui/SocketProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Loader2, Heart, Briefcase, GraduationCap, Users, Coffee, Sparkles } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const TOPICS = [
    { id: "casual", label: "Casual Chat", icon: <Coffee className="w-5 h-5" /> },
    { id: "venting", label: "Just Venting", icon: <Heart className="w-5 h-5" /> },
    { id: "career", label: "Career Advice", icon: <Briefcase className="w-5 h-5" /> },
    { id: "academics", label: "School & Studies", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "relationships", label: "Relationships", icon: <Users className="w-5 h-5" /> }
];

export default function Queue() {
    const { socket } = useSocket();
    const router = useRouter();
    const [status, setStatus] = useState<"selecting" | "queueing">("selecting");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    useEffect(() => {
        if (!socket) return;
        
        socket.on('matched', (data) => {
            router.push('/chat/' + data.room);
        });
        
        return () => {
            socket.off('matched');
        };
    }, [socket, router]);

    const handleJoinQueue = () => {
        if (!selectedTopic) return;
        setStatus("queueing");
        // We pass the topic to the backend. The backend socketHandler needs to expect an object now.
        socket?.emit("join_queue", { socketId: socket.id, topic: selectedTopic });
    };

    const handleCancel = () => {
        socket?.emit("leave_queue", { socketId: socket.id, topic: selectedTopic });
        setStatus("selecting");
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <AnimatePresence mode="wait">
                    {status === "selecting" ? (
                        <motion.div 
                            key="selecting"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-4xl font-black font-heading text-brand-dark mb-4">What's on your mind?</h1>
                                <p className="text-brand-dark/60 font-medium">Select a topic so we can connect you with the right someone.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {TOPICS.map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopic(topic.id)}
                                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                                            selectedTopic === topic.id 
                                            ? "border-brand-violet bg-brand-violet/5 shadow-md shadow-brand-violet/10" 
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-500"
                                        }`}
                                    >
                                        <div className={`${selectedTopic === topic.id ? "text-brand-violet" : "text-gray-400"}`}>
                                            {topic.icon}
                                        </div>
                                        <span className={`font-bold ${selectedTopic === topic.id ? "text-brand-violet" : "text-gray-600"}`}>
                                            {topic.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <Button 
                                disabled={!selectedTopic}
                                onClick={handleJoinQueue}
                                className="w-full py-7 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-lg shadow-xl shadow-brand-violet/25 disabled:opacity-50 transition-all hover:-translate-y-1"
                            >
                                <Sparkles className="w-5 h-5 mr-2" /> Find My Someone
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="queueing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center my-20"
                        >
                            {/* The Radar Pulse Animation */}
                            <div className="relative flex items-center justify-center mb-10">
                                {/* Outer Ring */}
                                <motion.div
                                    className="absolute w-24 h-24 rounded-full border-[1.5px] border-brand-violet/20"
                                    animate={{ scale: [1, 1.8, 2.5], opacity: [0.8, 0.3, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                />
                                {/* Inner Ring */}
                                <motion.div
                                    className="absolute w-24 h-24 rounded-full border-[1.5px] border-brand-violet/40"
                                    animate={{ scale: [1, 1.8, 2.5], opacity: [0.8, 0.3, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                                />

                                {/* Center Pill */}
                                <div className="w-16 h-16 bg-white rounded-full shadow-xl shadow-brand-violet/5 border border-gray-100 flex items-center justify-center z-10 relative">
                                    <Loader2 className="w-6 h-6 text-brand-violet animate-spin" strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Typography */}
                            <h2 className="text-2xl font-black text-brand-dark tracking-tight my-4 font-heading text-center">
                                Finding your someone...
                            </h2>
                            <p className="text-[14px] font-medium text-brand-dark/50 mb-10 max-w-xs text-center leading-relaxed">
                                We're securely matching you with an available listener for <span className="font-bold text-brand-violet">{TOPICS.find(t => t.id === selectedTopic)?.label}</span>. This usually takes a moment.
                            </p>

                            {/* Escape Hatch */}
                            <Button
                                variant="outline"
                                className="rounded-xl border-gray-200 text-brand-dark/70 hover:bg-gray-50 hover:text-brand-dark px-8 py-6 font-bold shadow-sm transition-all hover:-translate-y-0.5"
                                onClick={handleCancel}
                            >
                                Cancel Search
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
