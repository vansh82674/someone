"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className}
    >
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  );
}
