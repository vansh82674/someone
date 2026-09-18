"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // If signup is successful, redirect to login page
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-black/5 border border-gray-100"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="font-heading font-black text-2xl tracking-widest text-brand-dark">
              S<span className="text-brand-violet mx-0.5">O</span>MEONE
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight mb-2">Create an account</h1>
          <p className="text-sm text-brand-dark/60 font-medium">Join the sanctuary. Be someone's Someone.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-dark/80 px-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Doe"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all text-brand-dark font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-dark/80 px-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all text-brand-dark font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-dark/80 px-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all text-brand-dark font-medium"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-500 text-sm font-semibold text-center bg-red-50 py-2 rounded-lg">
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email || !password || !name}
            className="w-full py-6 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-[15px] shadow-lg shadow-brand-violet/25 hover:shadow-xl hover:shadow-brand-violet/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm font-medium text-brand-dark/60 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-violet font-bold hover:text-brand-violet/80 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
