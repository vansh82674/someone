'use client'
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import TopicsGrid from "@/components/ui/TopicsGrid";
import ValueProposition from "@/components/ui/ValueProposition";
import ProcessSteps from "@/components/ui/ProcessSteps";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TopicsGrid />
        <ValueProposition />
        <ProcessSteps />
      </main>
    </div>
  );
}
