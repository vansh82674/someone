'use client'
import { useEffect } from "react";
import { useSocket } from "@/components/ui/SocketProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Loader2 } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Queue() {
    const { socket } = useSocket();
    const router = useRouter();

    useEffect(() => {

        if (!socket) return

        socket?.emit("join_queue", socket.id)
        socket?.on('matched', (data) => {
            router.push('/chat/' + data.room)
        })
        return () => {
            socket?.off('matched')
        }
    }, [socket, router])

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative my-32">

                {/* The Radar Pulse Animation */}
                <div className="relative flex items-center justify-center mb-10 mt-[-5vh]">
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
                <h2 className="text-2xl font-black text-brand-dark tracking-tight my-4 font-heading">
                    Finding your someone...
                </h2>
                <p className="text-[14px] font-medium text-brand-dark/50 mb-10 max-w-70  text-center leading-relaxed">
                    We're securely matching you with an available listener. This usually takes a moment.
                </p>

                {/* Escape Hatch */}
                <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 text-brand-dark/70 hover:bg-gray-50 hover:text-brand-dark px-6 py-5 font-bold shadow-sm transition-all hover:-translate-y-0.5"
                    onClick={() => router.push('/')}
                >
                    Cancel Search
                </Button>
            </div>

            <Footer />
        </div>
    );
}
