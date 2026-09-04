import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
export default function FaqSection() {
    const faqs = [
        {
            question: "What is SOMEONE?",
            answer: "SOMEONE is an anonymous human-connection platform designed for moments when you need a private, thoughtful conversation with another human who has no prior stake or judgment in your life."
        },
        {
            question: "Who are Someones?",
            answer: "Someones are verified, empathetic individuals from varied walks of life—former operators, active listeners, peer mentors, and creative thinkers who have passed our identity check and community guidelines screening."
        },
        {
            question: "Can I remain completely anonymous?",
            answer: "Yes. You never have to share your real name, video, or identifiable details. You are simply 'You' to them."
        },
        {
            question: "How does matching work?",
            answer: "When you select a topic, our system instantly connects you with an available Someone who specializes in that area. If you purchase an Expert Session, you can browse and select specific profiles."
        },
        {
            question: "How much does a session cost?",
            answer: "Standard sessions cost ₹99 for 30 minutes and ₹199 for 60 minutes. Expert sessions start from ₹499."
        },
        {
            question: "Is SOMEONE a therapy or medical service?",
            answer: "No. SOMEONE is strictly for peer-to-peer connection and sounding-board conversations. It is not a substitute for professional therapy, counseling, or medical advice."
        },
        {
            question: "How are Someones verified?",
            answer: "Every Someone undergoes a strict multi-step vetting process including identity verification, video interviews, and behavioral assessments to ensure empathy and adherence to our community guidelines."
        },
        {
            question: "Can I become a Someone?",
            answer: "Yes! If you are a great listener with valuable perspectives, you can apply to become a Someone. We regularly open up applications for new applications."
        },
        {
            question: "How do I report someone for inappropriate behavior?",
            answer: "You can instantly end any session and use the in-app reporting tool. Our trust and safety team reviews all reports immediately and takes strict action against violators."
        }
    ];

    return (
        <section className="bg-white py-18 px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-4">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-brand-violet mb-3">Questions & Answers</p>
                <h2 className="text-3xl md:text-[40px] leading-none text-brand-dark font-black tracking-tighter mb-4">Frequently Asked Questions</h2>
                <p className="text-xs md:text-sm text-brand-dark/50 font-medium mb-8">Everything you need to know about the SOMEONE platform.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <Accordion className="w-full flex flex-col gap-3">
                    {faqs.map((q, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-gray-100 bg-brand-cream rounded-[16px] px-6 border-b-gray-100! shadow-sm"
                        >
                            <AccordionTrigger className="text-left font-bold text-base text-brand-dark hover:text-brand-violet hover:no-underline py-5 border-none">
                                {q.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-brand-dark/60 font-medium leading-relaxed pb-6 pt-0">
                                {q.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}