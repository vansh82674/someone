'use client';

import { ShieldCheck, Lock, Trash2, EyeOff, HeartHandshake } from "lucide-react";
import { Card } from "./card";

export default function SafetySection({ onOpenEmergency }: { onOpenEmergency?: () => void }) {
    const safetyPillars = [
        {
            icon: EyeOff,
            title: "Zero Identity Footprint",
            desc: "Your real name, email, and social profiles are never shared. You are known only by an ephemeral Anonymous ID (e.g. anon-4912) to ensure unbiased, judgment-free conversations.",
            badge: "100% Anonymous"
        },
        {
            icon: Trash2,
            title: "In-Memory Ephemeral Chats",
            desc: "Messages reside strictly in an in-memory Redis buffer during active sessions. As soon as a conversation concludes, the buffer is purged. Zero chat transcripts in PostgreSQL.",
            badge: "Auto-Purged"
        },
        {
            icon: ShieldCheck,
            title: "Verified Community Listeners",
            desc: "All 'Verified Someones' undergo comprehensive identity verification and community empathy screening before they can accept conversations or earn on the platform.",
            badge: "Vetted Peers"
        }
    ];

    return (
        <section id="safety" className="w-full bg-[#17141F] text-white py-24 px-6 scroll-mt-24 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-violet/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#A684FF] mb-3 inline-block">
                        Trust, Safety & Zero Baggage
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 text-white">
                        Designed for absolute emotional safety.
                    </h2>
                    <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed">
                        We built SOMEONE because opening up requires absolute trust. Here is how we protect your peace of mind at every step.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {safetyPillars.map((pillar, idx) => (
                        <Card key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between hover:border-brand-violet/40 hover:bg-white/[0.07] transition-all duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-violet/20 flex items-center justify-center text-[#A684FF]">
                                        <pillar.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A684FF] bg-brand-violet/15 px-3 py-1 rounded-full border border-brand-violet/20">
                                        {pillar.badge}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-heading">
                                    {pillar.title}
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed font-medium">
                                    {pillar.desc}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Crisis Banner */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Need immediate clinical or emergency support?</h4>
                            <p className="text-xs text-white/50 font-medium">SOMEONE is peer-support. If in acute distress, free 24/7 certified crisis helplines are available.</p>
                        </div>
                    </div>
                    {onOpenEmergency && (
                        <button
                            type="button"
                            onClick={onOpenEmergency}
                            className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                            View Emergency Helplines
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
