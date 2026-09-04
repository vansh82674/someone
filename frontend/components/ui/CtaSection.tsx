import { Button } from "./button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
    return (
        <section className="bg-[#1C1816] py-24 px-6 flex flex-col items-center text-center w-full">
            <h2 className="text-3xl md:text-[42px] font-black tracking-tighter text-white mb-4">
                Ready to talk without the baggage?
            </h2>
            <p className="text-[#A19D9B] text-sm md:text-[15px] font-medium mb-8 max-w-lg">
                Experience unburdened human perspective. Find a verified Someone in under 60 seconds.
            </p>
            <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-full px-7 py-6 font-bold text-[15px] shadow-lg shadow-brand-violet/20 group">
                Find Your Someone <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </section>
    )
}
