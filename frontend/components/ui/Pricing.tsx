import { Card } from "./card";
import { Clock, DollarSign, Sparkles, Briefcase } from "lucide-react";

export default function Pricing() {
    const pricingFeatures = [
        {
            icon: Clock,
            title: "Pay Per Conversation",
            description: "Users pay transparent rates for single 30 or 60-minute sessions. Only pay when you need someone.",
            footer: "₹99 / 30m • ₹199 / 60m",
            iconColor: "text-brand-violet bg-brand-violet/10",
            footerColor: "text-brand-dark"
        },
        {
            icon: DollarSign,
            title: "Fair Commission",
            description: "SOMEONE retains a standard 15-20% commission on completed sessions to fund trust, verification, and safety.",
            footer: "80%+ directly to Someones",
            iconColor: "text-green-600 bg-green-50",
            footerColor: "text-green-600"
        },
        {
            icon: Sparkles,
            title: "Frequent Membership",
            description: "Optional monthly pass for frequent users wanting priority matching, saved session notes, and discounted bundles.",
            footer: "Optional Membership",
            iconColor: "text-blue-600 bg-blue-50",
            footerColor: "text-brand-violet"
        },
        {
            icon: Briefcase,
            title: "Expert Sessions",
            description: "Specialized sounding board sessions with proven senior operators, founders, and industry veterans.",
            footer: "From ₹499+",
            iconColor: "text-orange-600 bg-orange-50",
            footerColor: "text-brand-dark"
        }
    ];

    return (
        <section className="bg-brand-cream py-20 px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-violet mb-1">Sustainable Economics</p>
                <h2 className="text-3xl md:text-4xl leading-none text-brand-dark font-black tracking-tighter mb-2">Honest, Transparent Platform Pricing</h2>
                <p className="text-[13px] md:text-[14px] text-brand-dark/60 font-medium">Simple pay-per-conversation economics. No subscription locks or hidden fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
                {pricingFeatures.map((feature, index) => (
                    <Card key={index} className="flex flex-col p-6 rounded-[24px] bg-white border-transparent hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">

                        <div className={`w-11 h-11 ${feature.iconColor} rounded-[14px] flex items-center justify-center mb-3`}>
                            <feature.icon className="w-4 h-4" strokeWidth={2.5} />
                        </div>

                        <h3 className="font-bold text-xl text-brand-dark leading-none tracking-tight mb-1">{feature.title}</h3>
                        <p className="text-[12.5px] text-brand-dark/60 leading-relaxed font-medium mb-2">
                            {feature.description}
                        </p>

                        <div className="mt-auto">
                            <div className="h-px bg-gray-100 w-full my-2" />
                            <p className={`font-bold text-xs tracking-tight ${feature.footerColor}`}>
                                {feature.footer}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}
