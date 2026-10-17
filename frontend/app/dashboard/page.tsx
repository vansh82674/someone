"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Clock, Info, CheckCircle2, RefreshCcw, Sparkles, BadgeCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import WalletManager from "@/components/WalletManager";
import axios from "axios";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (activeTab === "past" && session?.user && pastSessions.length === 0) {
      fetchPastSessions();
    }
  }, [activeTab, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-violet"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

  const fetchPastSessions = async () => {
    if (!session?.user) return;
    setIsLoadingPast(true);
    try {
      const res = await axios.get(`${backendUrl}/api/sessions/past/${(session.user as any).id}`);
      setPastSessions(res.data);
    } catch (error) {
      console.error("Failed to fetch past sessions:", error);
    } finally {
      setIsLoadingPast(false);
    }
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming Conversations" },
    { id: "past", label: `Past Conversations (${pastSessions.length})` },
    { id: "saved", label: "Saved Someones" },
    { id: "wallet", label: "Wallet & Credits" },
    { id: "privacy", label: "Privacy & Identity" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black font-heading text-brand-dark mb-3 tracking-tight">
            Good morning, {session?.user?.name || "Someone"}.
          </h1>
          <p className="text-lg text-brand-dark/60 font-medium">
            Your sanctuary awaits. Here are your sessions.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-sm font-bold rounded-full whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-brand-dark bg-gray-100"
                  : "text-gray-400 hover:text-brand-dark/70 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "upcoming" && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-10 h-10 text-brand-violet/40" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">No Upcoming Conversations</h3>
                  <p className="text-gray-500 font-medium max-w-sm mb-6 text-sm">
                    Ready to talk, vent, or think out loud? Enter the queue to find someone in seconds.
                  </p>
                  <Link href="/queue">
                    <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-6 py-6 font-bold shadow-lg shadow-brand-violet/20 cursor-pointer">
                      <Sparkles className="w-4 h-4 mr-2" /> Find Someone Now
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "past" && (
              <motion.div
                key="past"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {isLoadingPast ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <RefreshCcw className="w-8 h-8 text-brand-violet animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading your past sessions...</p>
                  </div>
                ) : pastSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">No Past Conversations</h3>
                    <p className="text-gray-500 font-medium max-w-xs text-sm">Your past conversation history will appear here once you complete a session.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pastSessions.map((session: any) => (
                      <div key={session.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-bold text-brand-dark">Chat with {session.partnerAnonId}</p>
                          <p className="text-sm text-gray-500">{new Date(session.createdAt).toLocaleDateString()} • {Math.round(session.durationSeconds / 60)} minutes</p>
                        </div>
                        <div className="text-sm font-semibold px-3 py-1 bg-brand-violet/10 rounded-lg text-brand-violet">
                          {session.topic || 'Casual'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === "saved" && (
              <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-brand-violet text-white font-bold rounded-2xl flex items-center justify-center text-lg shadow-sm">
                        ML
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-brand-dark">Maya Lin</h4>
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase">
                            <BadgeCheck className="w-3.5 h-3.5 text-green-600" /> Verified
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Mindful Guide & Life Transitions</p>
                      </div>
                    </div>
                    <Link href="/queue?topic=Casual%20Chat">
                      <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl text-xs font-bold px-4 py-2.5 shadow-md shadow-brand-violet/20 cursor-pointer">
                        Connect Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-600 italic bg-brand-cream/60 p-4 rounded-xl mb-6">
                    "Offering patient, calming perspective for navigating life pivots, relationship crossroads, or everyday mental clutter."
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">Want to save more Someones?</span>
                    <Link href="/explore" className="text-brand-violet hover:underline text-xs font-bold flex items-center gap-1">
                      Browse Community Directory <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "wallet" && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-10">
                <WalletManager />
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-10">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-brand-violet/10 rounded-2xl">
                      <ShieldCheck className="w-6 h-6 text-brand-violet" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark mb-1">Identity Masking</h3>
                      <p className="text-sm text-gray-500 font-medium">Your real name is never shared with listeners. Only your Anon ID is visible during sessions.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-600">Your Anon ID</span>
                    <span className="font-mono text-brand-violet font-bold bg-brand-violet/10 px-3 py-1 rounded-lg">
                      {(session?.user as any)?.anonId || 'anon-0000'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
