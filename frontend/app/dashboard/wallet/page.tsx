import WalletManager from "@/components/WalletManager";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-brand-cream overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-24">
        <h1 className="text-4xl font-black font-heading text-brand-dark mb-10 text-center tracking-tight">
          Your Wallet
        </h1>
        <WalletManager />
      </main>

      <Footer />
    </div>
  );
}
