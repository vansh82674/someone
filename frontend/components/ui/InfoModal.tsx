'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, PhoneCall, ShieldCheck, FileText, HeartHandshake, AlertCircle, ExternalLink, Lock } from "lucide-react";
import { Button } from "./button";

export type ModalType = 'emergency' | 'safety' | 'guidelines' | 'terms' | 'report' | null;

interface InfoModalProps {
    type: ModalType;
    onClose: () => void;
}

export default function InfoModal({ type, onClose }: InfoModalProps) {
    if (!type) return null;

    const modalData = {
        emergency: {
            icon: PhoneCall,
            iconBg: "bg-red-50 text-red-600",
            title: "24/7 Emergency & Crisis Helplines",
            subtitle: "SOMEONE is a peer sounding-board, not a crisis service. If you are experiencing acute distress, self-harm thoughts, or physical danger, please reach out to these free, confidential, 24/7 resources immediately.",
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-900 font-medium leading-relaxed">
                            These services are free, confidential, available 24/7, and answered by trained mental health professionals and crisis counselors.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-brand-dark">Tele-MANAS (India)</span>
                                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">National Helpline</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Government of India mental health initiative (Toll-free)</p>
                            </div>
                            <a href="tel:14416" className="bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors">
                                <PhoneCall className="w-3.5 h-3.5" /> 14416
                            </a>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-sm text-brand-dark">Vandrevala Foundation</span>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Free 24/7 mental health counseling across India</p>
                            </div>
                            <a href="tel:9999666555" className="bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors">
                                <PhoneCall className="w-3.5 h-3.5" /> 9999 666 555
                            </a>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-sm text-brand-dark">KIRAN Mental Health Helpline</span>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Govt. helpline supporting 13 languages</p>
                            </div>
                            <a href="tel:18005990019" className="bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors">
                                <PhoneCall className="w-3.5 h-3.5" /> 1800-599-0019
                            </a>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-sm text-brand-dark">United States & Canada Suicide & Crisis Lifeline</span>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">24/7 call or text support</p>
                            </div>
                            <a href="tel:988" className="bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors">
                                <PhoneCall className="w-3.5 h-3.5" /> 988
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        safety: {
            icon: ShieldCheck,
            iconBg: "bg-brand-violet/10 text-brand-violet",
            title: "Zero-PII & Privacy Principles",
            subtitle: "Your privacy is not a setting on SOMEONE; it is the fundamental architecture of the platform.",
            content: (
                <div className="space-y-4 text-brand-dark/80 text-sm leading-relaxed">
                    <div className="p-4 bg-brand-cream rounded-2xl border border-brand-violet/15 flex items-start gap-3">
                        <Lock className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-brand-dark text-sm">Ephemeral In-Memory Architecture</h4>
                            <p className="text-xs text-brand-dark/70 font-medium mt-1">
                                Chat messages reside exclusively in an in-memory Redis circular buffer during your active session. When you or your partner click 'Leave Chat', that buffer is permanently deleted. Zero conversation text is stored in PostgreSQL.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-brand-dark text-sm">Identity Masking</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                Conversational partners only see your random Anonymous ID (e.g. anon-3912). Your registered email and real name are never exposed to listeners or other users.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-brand-dark text-sm">Encrypted Abuse Escrow</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                If a user clicks 'Report Abuse', the last 10 messages from that session are sealed with asymmetric KMS encryption and queued exclusively for Trust & Safety review. If unflagged, no log is kept.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        guidelines: {
            icon: HeartHandshake,
            iconBg: "bg-green-50 text-green-600",
            title: "Community Guidelines",
            subtitle: "To keep SOMEONE a sanctuary, every seeker and listener agrees to these fundamental core standards.",
            content: (
                <div className="space-y-3 text-sm text-brand-dark/80">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-brand-dark text-sm">1. Respect & Empathy First</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Listen actively without interrupting, judging, or minimizing another human's personal experience.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-brand-dark text-sm">2. Maintain Absolute Anonymity</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Do not ask for or share real names, social media handles, phone numbers, addresses, or external payment links.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-brand-dark text-sm">3. Zero Tolerance for Abuse</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Hate speech, sexual harassment, threats, and predatory behavior result in immediate, permanent bans and device blacklisting.
                        </p>
                    </div>
                </div>
            )
        },
        terms: {
            icon: FileText,
            iconBg: "bg-blue-50 text-blue-600",
            title: "Terms of Care",
            subtitle: "Clear, transparent boundaries regarding what SOMEONE is and is not.",
            content: (
                <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-medium">
                    <p>
                        <strong>1. Non-Clinical Service:</strong> SOMEONE is a peer-to-peer human perspective and sounding-board platform. It does NOT provide medical diagnosis, clinical therapy, psychiatry, or emergency response services.
                    </p>
                    <p>
                        <strong>2. Transparent Credits:</strong> Users pre-load wallet credits via Razorpay to initiate sessions with verified listeners. Deductions occur at transparent per-minute rates with an initial 30-second free grace period.
                    </p>
                    <p>
                        <strong>3. Code of Conduct:</strong> Violation of user safety, harassment, or attempts to circumvent anonymity will cause immediate account suspension and forfeiture of unused credits.
                    </p>
                </div>
            )
        },
        report: {
            icon: AlertCircle,
            iconBg: "bg-orange-50 text-orange-600",
            title: "Report an Issue or Safety Concern",
            subtitle: "Our Trust & Safety team investigates all reports promptly.",
            content: (
                <div className="space-y-4 text-sm text-brand-dark/80">
                    <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-2xl text-xs text-orange-900 font-medium leading-relaxed">
                        To report an active conversation partner, use the red <strong>Report</strong> button located inside the chat room header during or right after a session.
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-brand-dark text-sm">Email Trust & Safety</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            For technical bugs, platform grievances, or safety inquiries, email us directly:
                        </p>
                        <a 
                            href="mailto:safety@someone.care?subject=SOMEONE%20Safety%20Inquiry" 
                            className="inline-flex items-center gap-1.5 text-brand-violet font-bold text-xs mt-2 hover:underline"
                        >
                            safety@someone.care <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            )
        }
    };

    const current = modalData[type];
    const IconComponent = current.icon;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-5 shrink-0">
                        <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${current.iconBg}`}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-heading text-brand-dark tracking-tight leading-snug">
                                    {current.title}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors shrink-0"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mb-6 shrink-0">
                        {current.subtitle}
                    </p>

                    {/* Scrollable Content Body */}
                    <div className="overflow-y-auto pr-1 flex-1">
                        {current.content}
                    </div>

                    {/* Footer Close */}
                    <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end shrink-0">
                        <Button
                            onClick={onClose}
                            className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-6 py-2.5 font-bold text-sm"
                        >
                            Got It
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
