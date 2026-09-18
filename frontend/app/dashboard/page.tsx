"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Clock, Info, CheckCircle2, RefreshCcw } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  useEffect(() => {
    if (activeTab === "past" && session?.user && pastSessions.length === 0) {
      fetchPastSessions();
    }
  }, [activeTab, session]);

  const fetchPastSessions = async () => {
    if (!session?.user) return;
    setIsLoadingPast(true);
    try {
      const res = await fetch(`http://localhost:8081/api/sessions/past/${(session.user as any).id}`);
      if (res.ok) {
        const data = await res.json();
        setPastSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch past sessions:", error);
    } finally {
      setIsLoadingPast(false);
    }
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming Conversations (1)" },
    { id: "past", label: `Past Conversations (${pastSessions.length})` },
    { id: "saved", label: "Saved Someones (1)" },
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
                {/* Session Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex gap-5 items-start">
                    <Avatar className="w-16 h-16 shadow-md border-2 border-white">
                      <AvatarFallback className="bg-linear-to-br from-brand-violet to-indigo-600 text-white text-xl font-bold">
                        Y
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-brand-dark">Dr. Yagbal Kapil</h3>
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Listener
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm font-medium text-brand-dark/70 pt-1">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-4 h-4 text-brand-violet" />
                          Today at 06:00 PM
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-4 h-4" />
                          60 Mins (Voice)
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Info className="w-4 h-4" />
                          Career
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="outline" className="rounded-xl px-6 py-5 font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200">
                      Cancel
                    </Button>
                    <Button className="rounded-xl px-8 py-5 font-bold bg-brand-violet hover:bg-brand-violet/90 text-white shadow-lg shadow-brand-violet/20">
                      Enter Conversation
                    </Button>
                  </div>
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
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">No Past Conversations</h3>
                    <p className="text-gray-500 font-medium max-w-xs">Your past conversation history will appear here once you complete a session.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pastSessions.map((session: any) => (
                      <div key={session.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-brand-dark">Chat with {session.partnerAnonId}</p>
                          <p className="text-sm text-gray-500">{new Date(session.createdAt).toLocaleDateString()} • {Math.round(session.durationSeconds / 60)} minutes</p>
                        </div>
                        <div className="text-sm font-medium px-3 py-1 bg-gray-50 rounded-lg text-gray-600">
                          {session.topic || 'Casual'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === "saved" && (
              <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-10 text-center">
                <p className="text-gray-500 font-medium">You have 1 saved someone.</p>
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
