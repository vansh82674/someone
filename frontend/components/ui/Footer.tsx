'use client';

import { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import InfoModal, { ModalType } from "./InfoModal";

export default function Footer() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <footer className="bg-brand-dark text-white pt-24 pb-10 px-6 w-full relative">
            <div className="max-w-6xl mx-auto">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 mb-20">

                    {/* Brand Column */}
                    <div className="md:col-span-5 pr-0 md:pr-12">
                        <Link href="/" className="text-[22px] font-black tracking-[0.15em] mb-6 inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                            S <div className="w-5 h-5 rounded-full bg-brand-violet flex items-center justify-center shrink-0"><div className="w-1.5 h-2.5 bg-white rounded-full" /></div> MEONE
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium pr-10">
                            A private, anonymous space to talk, think, and be heard with a verified human who has zero baggage or expectations of you.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/50 font-bold uppercase tracking-wider">
                            <button 
                                onClick={() => setActiveModal('safety')} 
                                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                            >
                                <Lock className="w-3.5 h-3.5" /> 100% Anonymous
                            </button>
                            <span className="text-brand-violet">•</span>
                            <Link href="/explore" className="flex items-center gap-1.5 text-green-500 hover:text-green-400 transition-colors">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Someones
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-[11px] uppercase tracking-widest text-white mb-6">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/queue" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">
                                    Find Your Someone
                                </Link>
                            </li>
                            <li>
                                <Link href="/become-someone" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">
                                    Become a Someone
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">
                                    User Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="font-bold text-[11px] uppercase tracking-widest text-white mb-6">Trust & Safety</h3>
                        <ul className="space-y-2">
                            <li>
                                <button 
                                    onClick={() => setActiveModal('safety')} 
                                    className="text-[13px] font-medium text-white/50 hover:text-white transition-colors text-left cursor-pointer"
                                >
                                    Safety & Ethics
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setActiveModal('report')} 
                                    className="text-[13px] font-medium text-white/50 hover:text-white transition-colors text-left cursor-pointer"
                                >
                                    Report an Issue
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setActiveModal('emergency')} 
                                    className="text-[13px] font-medium text-red-400/90 hover:text-red-300 transition-colors text-left cursor-pointer font-semibold"
                                >
                                    Emergency Helplines
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="font-bold text-[11px] uppercase tracking-widest text-white mb-6">Organization</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#about" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">
                                    About the Vision
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={() => setActiveModal('guidelines')} 
                                    className="text-[13px] font-medium text-white/50 hover:text-white transition-colors text-left cursor-pointer"
                                >
                                    Community Guidelines
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer Box */}
                <div className="bg-[#141820] border border-white/5 rounded-2xl p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                        <h4 className="font-bold text-[12px] text-white">Important Notice:</h4>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                        SOMEONE is a peer-to-peer human perspective and conversational platform. It is NOT a medical service, therapy provider, psychiatric care, or emergency crisis hotline. If you are experiencing acute clinical distress or physical danger, please contact local emergency authorities or certified crisis hotlines immediately (e.g. Tele-MANAS: 14416 / Vandrevala: 9999 666 555 / US: 988).
                    </p>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="text-xs text-white/40 font-medium">
                        © {new Date().getFullYear()} SOMEONE. All rights reserved. "You don't need everyone. You just need someone."
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-medium">
                        <button 
                            onClick={() => setActiveModal('safety')} 
                            className="text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                            Privacy Principles
                        </button>
                        <button 
                            onClick={() => setActiveModal('terms')} 
                            className="text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                            Terms of Care
                        </button>
                    </div>
                </div>

            </div>

            {/* Accessible Info Dialog */}
            <InfoModal type={activeModal} onClose={() => setActiveModal(null)} />
        </footer>
    );
}