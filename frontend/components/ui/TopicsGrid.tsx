import { MessageCircle, Compass, Luggage, Lightbulb, GraduationCap, Users, Sparkles, CircleHelp, LucideIcon, MoveRight, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "./button"

type MessageType = {
    icon: LucideIcon,
    title: string,
    description: string
}

export default function TopicsGrid() {
    const topics: MessageType[] = [
        {
            icon: MessageCircle,
            title: "Just Talk",
            description: "Unburden your mind freely"
        },
        {
            icon: Compass,
            title: "A Decision",
            description: "Navigate life's tough choices"
        },
        {
            icon: Luggage,
            title: "Moving On",
            description: "Letting go of the past"
        },
        {
            icon: Lightbulb,
            title: "Career",
            description: "Find your professional path"
        },
        {
            icon: GraduationCap,
            title: "Academics",
            description: "Manage study stress"
        },
        {
            icon: Users,
            title: "Relationships",
            description: "Connect better with others"
        },
        {
            icon: Sparkles,
            title: "Self Growth",
            description: "Become your best self"
        },
        {
            icon: CircleHelp,
            title: "Something Else",
            description: "Whatever is on your mind"
        }
    ]

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

    const handleSelectedTopic = (i: number) => {
        setSelectedTopic(topics[i].title)
    }

    return (
        <section className="bg-brand-cream py-24 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h3 className="mb-3 text-brand-violet font-sans text-sm">START HERE </h3>
                <h2 className="text-xl md:text-3xl font-black text-brand-dark mb-4 font-heading tracking-tight">
                    What do you need <span className="text-brand-violet">Someone</span> for?
                </h2>
                <p className="text-sm text-brand-dark/70 max-w-2xl mx-auto">
                    Choose a topic to find listeners who specialize in what you're going through right now.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {topics.map((topic, index) => {
                    const isSelected = selectedTopic === topic.title;

                    return (
                        <Card
                            key={index}
                            onClick={() => handleSelectedTopic(index)}
                            className={`group relative cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isSelected
                                ? 'bg-brand-deep border-brand-deep text-white ring-4 ring-brand-violet/30'
                                : 'bg-brand-cream border-gray-200 text-brand-dark hover:border-brand-violet/30'
                                }`}
                        >
                            <CardHeader className="flex flex-col items-start text-left px-6 gap-2">

                                {/* The Checkmark */}
                                {isSelected && (
                                    <CheckCircle2 className="absolute top-6 right-6 w-6 h-6 text-brand-violet fill-white" />
                                )}

                                {/* The Icon */}
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-colors duration-300 ${isSelected ? 'bg-white/10 text-white' : 'bg-white text-brand-violet group-hover:bg-brand-violet group-hover:text-white'
                                    }`}>
                                    <topic.icon className="w-5 h-5" strokeWidth={2} />
                                </div>

                                {/* The Text (No explicit text colors here, they inherit from the parent!) */}
                                <CardTitle className={`text-base font-bold transition-colors ${!isSelected && 'group-hover:text-brand-violet'}`}>
                                    {topic.title}
                                </CardTitle>
                                <CardDescription className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-brand-dark/60'}`}>
                                    {topic.description}
                                </CardDescription>

                            </CardHeader>
                        </Card>
                    );
                })}

            </div>
            {
                selectedTopic && (
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-sm md:max-w-none mx-auto">
                        <p className="text-brand-dark/70 text-sm md:text-base">
                            Selected focus: <strong className="text-brand-dark">{selectedTopic}</strong>
                        </p>
                        <Button className="w-full md:w-auto bg-brand-violet/90 hover:bg-brand-violet text-white rounded-xl px-6 py-6 text-base font-semibold">
                            Continue to Match <MoveRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                )
            }
        </section>
    )
}