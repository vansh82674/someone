'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, BadgeCheck, Sparkles, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export interface ListenerProfile {
    id: number;
    name: string;
    tagline: string;
    rating: number;
    reviewsCount: number;
    quote: string;
    topics: string[];
    price: string;
    bgColor: string;
}

interface ListenerProfileModalProps {
    listener: ListenerProfile | null;
    onClose: () => void;
}

export default function ListenerProfileModal({ listener, onClose }: ListenerProfileModalProps) {
    const router = useRouter();

    if (!listener) return null;

    const handleConnect = () => {
        onClose();
        // Route to queue with the listener's first topic
        const topicParam = listener.topics?.[0] ? `?topic=${encodeURIComponent(listener.topics[0])}` : '';
        router.push(`/queue${topicParam}`);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Top Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Listener Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 ${listener.bgColor || 'bg-brand-violet'} text-white font-bold text-xl flex items-center justify-center rounded-2xl shadow-md shrink-0`}>
                            {listener.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black font-heading text-brand-dark tracking-tight">
                                    {listener.name}
                                </h3>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    <BadgeCheck className="w-3.5 h-3.5 text-green-600" /> Verified
                                </span>
                            </div>
                            <p className="text-xs text-brand-dark/60 font-medium mt-0.5 leading-snug">
                                {listener.tagline}
                            </p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-transparent" />
                                ))}
                                <span className="text-xs font-bold text-brand-dark ml-1">{listener.rating || 5.0}</span>
                                <span className="text-xs text-brand-dark/40 font-medium">({listener.reviewsCount || 12} reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio / Quote Card */}
                    <div className="bg-brand-cream/80 p-5 rounded-2xl border border-gray-100 mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-violet block mb-1.5">
                            Listening Philosophy
                        </span>
                        <p className="text-sm text-brand-dark/80 italic font-medium leading-relaxed">
                            "{listener.quote}"
                        </p>
                    </div>

                    {/* Topics Specialization */}
                    <div className="mb-6">
                        <span className="text-xs font-bold text-brand-dark block mb-2.5">
                            Specialized Focus Areas
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {listener.topics?.map((topic, i) => (
                                <span 
                                    key={i}
                                    className="text-xs font-semibold text-brand-dark/80 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200/50 flex items-center gap-1.5"
                                >
                                    <MessageCircle className="w-3.5 h-3.5 text-brand-violet" /> {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pricing & Connect CTA */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4 mt-auto">
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Session Rate</span>
                            <span className="text-lg font-black text-brand-dark tracking-tight">{listener.price || '₹199 / hr'}</span>
                        </div>
                        <Button
                            onClick={handleConnect}
                            className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-6 py-6 font-bold text-sm shadow-lg shadow-brand-violet/20 flex items-center gap-2 group transition-all hover:-translate-y-0.5"
                        >
                            <Sparkles className="w-4 h-4" /> Connect in Queue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
