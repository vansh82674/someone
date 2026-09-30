"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, Plus, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletManager() {
  const { data: session, update } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [amountToAdd, setAmountToAdd] = useState<number>(200);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch actual balance from backend if it isn't fully in session yet, 
    // but session might be enough if we just added it to the auth provider.
    // For now, let's just fetch from an API if we had one.
    // Assuming backend added walletBalance to session in some form, or we can fetch it.
    // Let's create a quick API call to get user profile if needed, or just use session.
    // Since we didn't expose GET /api/users/me, let's just mock it or rely on session update.
    if ((session?.user as any)?.walletBalance !== undefined) {
      setBalance((session.user as any).walletBalance);
    }
  }, [session]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await axios.post("http://localhost:8081/api/wallet/create-order", {
        amount: amountToAdd,
        userId: (session?.user as any).id,
      });

      const { id: order_id, currency } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", // should use env
        amount: amountToAdd * 100,
        currency: currency,
        name: "Someone",
        description: "Add Credits to Wallet",
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await axios.post("http://localhost:8081/api/wallet/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: (session?.user as any).id,
              amount: amountToAdd,
            });

            if (verifyRes.data.success) {
              setBalance((prev) => prev + amountToAdd);
              await update({ walletBalance: balance + amountToAdd });
              alert("Payment successful! Credits added.");
            }
          } catch (error) {
            console.error("Verification failed", error);
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: {
          color: "#7C3AED", // brand-violet
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-brand-violet/10 rounded-2xl">
          <Wallet className="w-8 h-8 text-brand-violet" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-brand-dark">Wallet & Credits</h3>
          <p className="text-gray-500 font-medium">Manage your balance for anonymous matchmaking.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Current Balance</p>
          <div className="text-4xl font-black text-brand-dark">₹{balance}</div>
        </div>
        <ShieldCheck className="w-12 h-12 text-brand-violet/20" />
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-brand-dark">Add Credits</h4>
        <div className="grid grid-cols-3 gap-3">
          {[200, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmountToAdd(amt)}
              className={`p-4 rounded-xl font-bold transition-all border-2 ${
                amountToAdd === amt
                  ? "border-brand-violet bg-brand-violet/5 text-brand-violet"
                  : "border-transparent bg-gray-50 text-brand-dark hover:bg-gray-100"
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <div className="pt-4">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl py-6 text-lg font-bold shadow-xl shadow-brand-violet/20"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {isLoading ? "Processing..." : `Pay ₹${amountToAdd} Securely`}
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-green-500" /> Payments processed securely by Razorpay
        </div>
      </div>
    </div>
  );
}
