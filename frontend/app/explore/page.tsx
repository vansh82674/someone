'use client';

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BadgeCheck, Star, Sparkles, Filter, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListenerProfileModal, { ListenerProfile } from "@/components/ui/ListenerProfileModal";

const TOPIC_FILTERS = [
    "All Topics",
    "Casual Chat",
    "Just Venting",
    "Career Advice",
    "School & Studies",
    "Relationships"
];

export default function ExplorePage() {
    const router = useRouter();
    const [listeners, setListeners] = useState<ListenerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState("All Topics");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedListener, setSelectedListener] = useState<ListenerProfile | null>(null);

    useEffect(() => {
        const fetchListeners = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
                const res = await axios.get(`${backendUrl}/api/users/listeners`);
                setListeners(res.data);
            } catch (error) {
                console.error("Failed to fetch listeners:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListeners();
    }, []);

    const filteredListeners = listeners.filter((listener) => {
        const matchesTopic = selectedTopic === "All Topics" || listener.topics?.includes(selectedTopic);
        const matchesSearch = 
            listener.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listener.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listener.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listener.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesTopic && matchesSearch;
    });

    const handleConnect = (listener: ListenerProfile) => {
        const topicParam = listener.topics?.[0] ? `?topic=${encodeURIComponent(listener.topics[0])}` : '';
        router.push(`/queue${topicParam}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-violet mb-2 inline-block">
                        Community Directory
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black font-heading text-brand-dark tracking-tight mb-3">
                        Find a Verified Someone
                    </h1>
                    <p className="text-sm md:text-base text-brand-dark/60 font-medium">
                        Browse our directory of vetted, empathetic listeners ready to hold space for you without judgment.
                    </p>
                </div>

                {/* Search & Topic Filters */}
                <div className="max-w-4xl mx-auto mb-12 space-y-5">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by topic, listener name, or keywords (e.g. 'career', 'anxiety', 'calm')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-13 pr-6 py-4 bg-white border border-gray-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-violet/20 shadow-sm"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1 mr-2" />
                        {TOPIC_FILTERS.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => setSelectedTopic(topic)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    selectedTopic === topic
                                        ? "bg-brand-violet text-white shadow-md shadow-brand-violet/20"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70"
                                }`}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Directory Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-violet mb-4" />
                        <p className="text-gray-500 font-medium text-sm">Discovering verified Someones...</p>
                    </div>
                ) : filteredListeners.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">No Someones Found</h3>
                        <p className="text-gray-500 font-medium text-xs mb-6">
                            No verified listeners match your current filters. Try resetting the search or exploring other topics.
                        </p>
                        <Button 
                            onClick={() => { setSelectedTopic("All Topics"); setSearchQuery(""); }}
                            className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl text-xs font-bold"
                        >
                            Reset Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListeners.map((listener) => (
                            <Card 
                                key={listener.id} 
                                className="flex flex-col p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3.5 mb-4">
                                    <div className={`w-12 h-12 ${listener.bgColor || 'bg-brand-violet'} text-white font-bold text-base flex items-center justify-center rounded-2xl shadow-sm shrink-0`}>
                                        {listener.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'S'}
                                    </div>
                                    <div className="flex flex-col items-start text-left w-full min-w-0">
                                        <div className="flex items-center gap-1.5 w-full">
                                            <h3 className="font-bold text-base text-brand-dark tracking-tight truncate">{listener.name}</h3>
                                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                                <BadgeCheck className="w-3.5 h-3.5 text-green-600" /> Verified
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand-dark/50 font-medium mt-0.5 truncate w-full">{listener.tagline}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-transparent" />
                                    ))}
                                    <span className="text-xs font-bold text-brand-dark ml-1">{listener.rating || 5.0}</span>
                                    <span className="text-xs text-brand-dark/40 font-medium">({listener.reviewsCount || 10})</span>
                                </div>

                                {/* Quote */}
                                <div className="bg-brand-cream/60 rounded-xl p-3.5 mb-4 flex-1">
                                    <p className="text-xs text-brand-dark/70 italic leading-relaxed line-clamp-3">
                                        "{listener.quote}"
                                    </p>
                                </div>

                                {/* Topics */}
                                <div className="flex flex-wrap items-center gap-1.5 mb-6">
                                    {listener.topics?.map((topic, i) => (
                                        <span key={i} className="text-[11px] font-semibold bg-gray-100 text-brand-dark/70 px-2.5 py-1 rounded-lg">
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                {/* Card Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="font-bold text-brand-dark text-sm">{listener.price || '₹199 / hr'}</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedListener(listener)}
                                            className="rounded-xl px-3 h-9 text-xs font-bold border-gray-200 hover:bg-gray-50"
                                        >
                                            Profile
                                        </Button>
                                        <Button
                                            onClick={() => handleConnect(listener)}
                                            className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-4 h-9 text-xs font-bold shadow-md shadow-brand-violet/20"
                                        >
                                            Connect <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Listener Modal */}
            <ListenerProfileModal
                listener={selectedListener}
                onClose={() => setSelectedListener(null)}
            />

            <Footer />
        </div>
    );
}
