"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { BadgeCheck, Star, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

interface Listener {
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

export default function VerifiedListeners() {
    const [listeners, setListeners] = useState<Listener[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchListeners = async () => {
        try {
          const res = await axios.get("http://localhost:8081/api/users/listeners");
          setListeners(res.data);
        } catch (error) {
          console.error("Failed to fetch listeners:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchListeners();
    }, []);

    if (isLoading) {
      return (
        <section className="bg-white py-24 px-6 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-violet" />
        </section>
      );
    }

    if (listeners.length === 0) {
      return null;
    }

    return (
        <section className="bg-white py-24 px-6">
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto items-start md:items-end justify-between gap-6">
                <div className="flex flex-col items-start text-left">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand-violet mb-1">Verified Listeners</p>
                    <h2 className="text-3xl md:text-[42px] leading-none text-brand-dark font-black tracking-tighter mb-1">Meet Verified Someones</h2>
                    <p className="text-[13px] md:text-[14px] text-brand-dark/60 font-medium max-w-xl">Real humans ready to offer thoughtful, non-judgmental perspectives.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button variant="outline" className="text-brand-dark rounded-lg h-9 p-5 border-gray-200 hover:bg-gray-50 text-sm font-bold group transition-all">
                        Explore All Someones <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mt-10">
                {listeners.map((listener, index) => (
                    <Card key={index} className="flex flex-col p-5 rounded-[20px] bg-brand-cream border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-11 h-11 ${listener.bgColor} text-white font-bold text-sm flex items-center justify-center rounded-[14px] shrink-0`}>
                                {listener.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start text-left w-full">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-base text-brand-dark tracking-tight">{listener.name}</h3>
                                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 px-1 py-0.5 uppercase tracking-wide">
                                        <BadgeCheck className="w-4 h-4" strokeWidth={1.5} /> Verified
                                    </span>
                                </div>
                                <p className="text-xs text-brand-dark/50 font-medium mt-0.5 leading-tight">{listener.tagline}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i === 4 && listener.rating < 5 ? 'fill-yellow-400 opacity-30 text-transparent' : 'fill-yellow-400 text-transparent'}`} />
                            ))}
                            <span className="text-xs font-bold text-brand-dark ml-1.5">{listener.rating}</span>
                            <span className="text-xs text-brand-dark/40 font-medium ml-0.5">({listener.reviewsCount})</span>
                        </div>

                        {/* Quote Box */}
                        <div className="bg-white rounded-xl p-3.5 shadow-sm border-none mb-3">
                            <p className="text-xs text-brand-dark/70 italic leading-relaxed text-left">
                                "{listener.quote}"
                            </p>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 px-2">
                            {listener.topics.map((topic, i) => (
                                <span key={i} className="text-xs font-medium text-brand-dark/60">
                                    {topic}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="font-bold text-brand-dark text-sm tracking-tight">{listener.price}</div>
                            <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-[10px] px-4 py-5 h-7 text-sm font-bold shadow-none">
                                View Profile
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}