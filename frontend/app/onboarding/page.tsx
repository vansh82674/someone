import Navbar from "@/components/ui/Navbar";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-brand-cream">
            <Navbar />
            <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex items-center justify-center">
                <div className="text-center w-full bg-white p-10 md:p-14 rounded-[40px] shadow-xl shadow-black/5 border border-gray-100">
                    <div className="w-20 h-20 mx-auto rounded-full bg-brand-violet/10 flex items-center justify-center mb-8">
                        <Sparkles className="w-10 h-10 text-brand-violet" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight mb-4">Complete Your Profile</h1>
                    <p className="text-lg text-brand-dark/70 font-medium mb-10 max-w-md mx-auto">
                        Tell us a bit more about yourself so we can match you with the best people to talk to.
                    </p>
                    <div className="space-y-6">
                        <div className="p-8 bg-gray-50 border border-gray-200 rounded-3xl text-brand-dark/50 italic font-medium">
                            Profile setup wizard is currently under construction.
                        </div>
                        <Link href="/dashboard" className="inline-block w-full">
                            <Button className="w-full py-6 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-lg shadow-lg shadow-brand-violet/25 hover:shadow-xl hover:shadow-brand-violet/30 hover:-translate-y-0.5 transition-all">
                                Skip to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
