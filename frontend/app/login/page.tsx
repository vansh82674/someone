"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
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
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-brand-dark/60 font-medium">Enter your details to sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-bold text-brand-dark/80">Password</label>
              <Link href="#" className="text-xs font-bold text-brand-violet hover:text-brand-violet/80 transition-colors">
                Forgot password?
              </Link>
            </div>
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
            disabled={isLoading || !email || !password}
            className="w-full py-6 rounded-2xl bg-brand-violet hover:bg-brand-violet/90 text-white font-bold text-[15px] shadow-lg shadow-brand-violet/25 hover:shadow-xl hover:shadow-brand-violet/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm font-medium text-brand-dark/60 mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-violet font-bold hover:text-brand-violet/80 transition-colors">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
