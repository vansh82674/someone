"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function BecomeSomeonePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    tagline: "",
    quote: "",
    topics: "",
    price: "₹199 / 60m",
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-violet" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/become-someone");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:8081/api/users/apply-listener`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          tagline: formData.tagline,
          quote: formData.quote,
          topics: formData.topics.split(",").map(t => t.trim()).filter(t => t),
          price: formData.price,
          bgColor: "bg-brand-violet",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      setSuccess(true);
      // Tell Next-Auth to update the local cookie with their new status
      await update({ role: 'LISTENER', isVerified: false });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  // Wait for the session to load
  if (!session) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;

  const role = (session.user as any).role;
  const isVerified = (session.user as any).isVerified;

  // If they are already a verified listener
  if (role === 'LISTENER' && isVerified === true) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-black text-brand-dark mb-4">You are already a Verified Someone!</h1>
          <Button onClick={() => router.push("/dashboard")} className="bg-brand-violet text-white">Go to Dashboard</Button>
        </main>
      </div>
    )
  }

  // If they applied but are waiting for admin approval
  if (role === 'LISTENER' && isVerified === false) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-20 h-20 text-blue-500 mb-6 animate-spin" />
          <h1 className="text-3xl font-black text-brand-dark mb-4">Application Under Review</h1>
          <p className="text-gray-500 mb-8 max-w-md">Your application to become a listener is currently being reviewed by our team. Please check back later.</p>
        </main>
      </div>
    )
  }

  // Otherwise, they are a normal USER (role === 'USER')
  // Show the normal return statement (the Application form) below!

  return (
    <div className="min-h-screen bg-brand-cream overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center"
        >
          {success ? (
            <div className="flex flex-col items-center justify-center py-10">
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
              <h1 className="text-3xl font-black text-brand-dark mb-4 tracking-tight">Application Submitted!</h1>
              <p className="text-gray-500 font-medium mb-8 max-w-md">
                Thank you for applying to become a Verified Someone. Our team will review your application and get back to you shortly.
              </p>
              <Button onClick={() => router.push("/dashboard")} className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl px-8 py-6 text-lg font-bold">
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-black font-heading text-brand-dark mb-4 tracking-tight">
                Become a Someone
              </h1>
              <p className="text-lg text-brand-dark/60 font-medium mb-10 max-w-xl mx-auto">
                Join our community of empathetic listeners and get paid to help others navigate life's challenges.
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-medium text-sm text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark ml-1">Your Tagline</label>
                  <input
                    required
                    placeholder="e.g. Mindful Listener & Perspective Guide"
                    className="flex w-full bg-gray-50 border-none h-14 rounded-2xl px-5 text-brand-dark font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
                    value={formData.tagline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark ml-1">Your Quote / Bio</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Calm listener who enjoys helping people see situations from a different perspective."
                    className="flex w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-brand-dark font-medium resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2"
                    value={formData.quote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, quote: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark ml-1">Topics of Expertise (comma separated)</label>
                  <input
                    required
                    placeholder="e.g. Relationships, Career, Personal Decisions"
                    className="flex w-full bg-gray-50 border-none h-14 rounded-2xl px-5 text-brand-dark font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
                    value={formData.topics}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, topics: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark ml-1">Hourly Rate</label>
                  <input
                    disabled
                    value={formData.price}
                    className="flex w-full bg-gray-100 border-none h-14 rounded-2xl px-5 text-gray-500 font-medium"
                  />
                  <p className="text-xs text-gray-400 ml-1 mt-1 font-medium">Standard rate for all new listeners.</p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-2xl h-16 text-lg font-bold shadow-xl shadow-brand-violet/20 mt-4"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
