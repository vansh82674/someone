"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2, Plus, Wallet, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletManager() {
  const { data: session, update } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [amountToAdd, setAmountToAdd] = useState<number>(200);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

  useEffect(() => {
    if ((session?.user as any)?.walletBalance !== undefined) {
      setBalance((session?.user as any).walletBalance);
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
    const finalAmount = isCustom ? parseInt(customAmount) || 0 : amountToAdd;
    if (finalAmount <= 0) {
      setNotification({ type: 'error', message: "Please enter a valid credit amount above ₹0." });
      return;
    }

    setIsLoading(true);
    setNotification(null);
    const res = await loadRazorpay();

    if (!res) {
      setNotification({ type: 'error', message: "Razorpay SDK failed to load. Please check your internet connection." });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await axios.post(`${backendUrl}/api/wallet/create-order`, {
        amount: finalAmount,
        userId: (session?.user as any).id,
      });

      const { id: order_id, currency } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
        amount: finalAmount * 100,
        currency: currency,
        name: "Someone",
        description: "Add Credits to Wallet",
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await axios.post(`${backendUrl}/api/wallet/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: (session?.user as any).id,
              amount: finalAmount,
            });

            if (verifyRes.data.success) {
              setBalance((prev) => prev + finalAmount);
              await update({ walletBalance: balance + finalAmount });
              setNotification({ type: 'success', message: `₹${finalAmount} credits added successfully to your wallet!` });
            }
          } catch (error) {
            console.error("Verification failed", error);
            setNotification({ type: 'error', message: "Payment verification failed. Please contact safety@someone.care." });
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
      setNotification({ type: 'error', message: "Failed to initiate payment. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveAmount = isCustom ? (parseInt(customAmount) || 0) : amountToAdd;

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-brand-violet/10 rounded-2xl">
          <Wallet className="w-8 h-8 text-brand-violet" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-brand-dark">Wallet & Credits</h3>
          <p className="text-gray-500 font-medium">Manage your balance for anonymous matchmaking with verified listeners.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Current Balance</p>
          <div className="text-4xl font-black text-brand-dark">₹{balance}</div>
        </div>
        <ShieldCheck className="w-12 h-12 text-brand-violet/20" />
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-medium ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-brand-dark">Select Amount</h4>
          <button 
            type="button"
            onClick={() => setIsCustom(!isCustom)}
            className="text-xs font-bold text-brand-violet hover:underline cursor-pointer"
          >
            {isCustom ? "Choose Presets" : "Enter Custom Amount"}
          </button>
        </div>

        {isCustom ? (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
            <input
              type="number"
              min="50"
              placeholder="e.g. 350"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark font-bold text-base focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[200, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmountToAdd(amt)}
                className={`p-4 rounded-xl font-bold transition-all border-2 cursor-pointer ${
                  amountToAdd === amt
                    ? "border-brand-violet bg-brand-violet/5 text-brand-violet shadow-sm"
                    : "border-transparent bg-gray-50 text-brand-dark hover:bg-gray-100"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handlePayment}
            disabled={isLoading || effectiveAmount <= 0}
            className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl py-6 text-lg font-bold shadow-xl shadow-brand-violet/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {isLoading ? "Processing..." : `Pay ₹${effectiveAmount} Securely`}
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-green-500" /> Payments processed securely by Razorpay • Instant Wallet Credit
        </div>
      </div>
    </div>
  );
}
