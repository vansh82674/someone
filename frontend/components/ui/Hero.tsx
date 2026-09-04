'use client';

import { motion } from 'framer-motion';
import { Button } from './button';
import { ShieldCheck, UserCheck, Heart } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 flex flex-col items-center text-center px-6">
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-150 bg-linear-to-b from-brand-violet/20 to-transparent blur-3xl rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-brand-violet font-bold tracking-widest uppercase text-xs sm:text-sm mb-6 inline-block"
                >
                    Human perspective, when you need it.
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl font-black text-brand-dark mb-8 leading-[1.1] tracking-tight font-heading"
                >
                    You don't need everyone.<br />
                    <span className="text-brand-violet">You just need someone.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg sm:text-xl text-brand-dark/70 max-w-2xl mb-12 leading-relaxed"
                >
                    A private space to talk with someone who gets it. No judgment, no strings attached, just genuine human connection when it matters most.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto"
                >
                    <Button size="lg" className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-4 py-6 text-lg font-semibold w-full sm:w-auto shadow-lg shadow-brand-violet/20 transition-all hover:scale-105">
                        Find Your Someone
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-xl px-4 py-6 text-lg font-semibold border-gray-300 w-full sm:w-auto hover:bg-gray-100 transition-all">
                        Become a Someone
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-brand-dark/70 font-semibold text-xs sm:text-sm"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-brand-violet" />
                        <span>100% Anonymous</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-green-500" />
                        <span>Verified Listeners</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span>Zero Baggage</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
