'use client'
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import TopicsGrid from "@/components/ui/TopicsGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main>
        <Hero />
        <TopicsGrid />
      </main>
    </div>
  );
}
