import { Card, CardHeader, CardDescription, CardTitle } from "./card"
import { Compass, Lock, MessageCircle } from "lucide-react"

export default function ProcessSteps() {

    const details = [
        {
            icon: MessageCircle,
            title: "Tell us what you need",
            description: "Choose the topic on your mind — career pivot, a difficult relationship crossroad, a business dilemma, or simply someone to listen."
        },
        {
            icon: Compass,
            title: "Find your Someone",
            description: "We match you with verified, vetted individuals who hold space without unsolicited judgment, advice overload, or social baggage."
        },
        {
            icon: Lock,
            title: "Talk without the baggage",
            description: "Have a completely anonymous, private conversation over voice, chat, or video. Leave feeling lighter, grounded, and clear."
        }
    ]

    return <section className="w-full bg-brand-cream">
        <div className="max-w-2xl mx-auto py-15 px-6 flex flex-col items-center justify-center">
            <p className="text-brand-violet uppercase font-bold text-sm mb-2 tracking-wide leading-none">The Process</p>
            <h2 className="text-xl md:text-4xl text-center mb-4 font-black tracking-tighter leading-none">
                One conversation can change a <span className="text-brand-violet">thought.</span>
            </h2>
            <h3 className="text-brand-dark/70 text-xs md:text-base">A frictionless 3-step journey from confusion to clarity.</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 pb-12">
            {
                details.map((detail, index) => {
                    return (
                        <Card key={index} className="relative bg-white border-gray-200 hover:border-brand-violet/30 hover:shadow-xl transition-all duration-300">
                            <CardHeader className="flex flex-col items-start text-left p-5 md:p-5">

                                {/* The absolute positioned icon */}
                                <div className={`absolute top-8 right-8 ${index === 2
                                    ? 'text-green-500'
                                    : 'text-brand-violet'
                                    }`}>
                                    <detail.icon className="w-5 h-5" />
                                </div>


                                {/* The Number */}
                                <span className={`text-sm font-bold px-3 py-1 rounded-md mb-6 w-fit ${index === 2
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-brand-violet/10 text-brand-violet'
                                    }`}>
                                    0{index + 1}
                                </span>

                                <CardTitle className="text-xl font-bold text-brand-dark mb-2">
                                    {detail.title}
                                </CardTitle>

                                <CardDescription className="text-brand-dark/70 text-sm leading-relaxed">
                                    {detail.description}
                                </CardDescription>

                            </CardHeader>
                        </Card>

                    )
                })
            }
        </div>
    </section>
}