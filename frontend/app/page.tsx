'use client'
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import TopicsGrid from "@/components/ui/TopicsGrid";
import ValueProposition from "@/components/ui/ValueProposition";
import ProcessSteps from "@/components/ui/ProcessSteps";
import VerifiedListeners from "@/components/ui/VerifiedListeners";
import Pricing from "@/components/ui/Pricing";
import FaqSection from "@/components/ui/FaqSection";
import CtaSection from "@/components/ui/CtaSection";
import Footer from "@/components/ui/Footer";
import { motion } from "framer-motion";

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="grow">
        <Hero />
        <FadeUp><TopicsGrid /></FadeUp>
        <FadeUp><ValueProposition /></FadeUp>
        <FadeUp><ProcessSteps /></FadeUp>
        <FadeUp><VerifiedListeners /></FadeUp>
        <FadeUp><Pricing /></FadeUp>
        <FadeUp><FaqSection /></FadeUp>
      </main>
      <FadeUp><CtaSection /></FadeUp>
      <Footer />
    </div>
  );
}
