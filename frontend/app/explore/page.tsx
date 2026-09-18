import Navbar from "@/components/ui/Navbar";
import { Sparkles, Users } from "lucide-react";

export default function ExplorePage() {
    return (
        <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex items-center justify-center">
                <div className="text-center max-w-2xl bg-white p-12 rounded-[40px] shadow-xl shadow-black/5 border border-gray-100">
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-brand-violet/10 flex items-center justify-center">
                            <Users className="w-8 h-8 text-brand-violet" />
                        </div>
                        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-brand-dark tracking-tight mb-4">Explore is coming soon!</h1>
                    <p className="text-lg text-brand-dark/70 leading-relaxed font-medium">
                        We're currently building a curated discovery feed to help you find people with similar interests. Check back later!
                    </p>
                </div>
            </main>
        </div>
    );
}
