import Link from 'next/link'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    const BrandGlyph = () => (
        <svg viewBox="0 0 100 100" className="w-7 h-7 md:w-6 md:h-6 inline-block mx-px -mt-1">
            {/* Left Perspective */}
            <path d="M 50 16 A 34 34 0 0 0 18 60 C 22 74, 36 84, 50 84 C 42 72, 40 58, 45 46 C 47 40, 50 28, 50 16 Z" className="fill-brand-violet" />

            {/* Right Perspective */}
            <path d="M 50 84 A 34 34 0 0 0 82 40 C 78 26, 64 16, 50 16 C 58 28, 60 42, 55 54 C 53 60, 50 72, 50 84 Z" className="fill-brand-violet opacity-80" />

            {/* The Connection Point */}
            <circle cx="50" cy="50" r="8" className="fill-violet-300" />
        </svg>
    );

    return (
        // Wrapper
        < div className='sticky top-0 z-50 w-full border-b bg-brand-cream/70 backdrop-blur-md flex items-center justify-between px-6 py-4' >
            {
                // The constraint container
            }
            <div className='max-w-7xl mx-auto flex items-center justify-between w-full'>
                {
                    // Logo 
                }
                <div className="font-heading font-black text-xl tracking-widest text-brand-dark cursor-pointer flex items-center">
                    S<BrandGlyph />MEONE
                </div>

                {
                    // Middle Links
                }
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-dark/70">
                    <Link href="#" className="hover:text-brand-dark transition-colors">How It Works</Link>
                    <Link href="#" className="hover:text-brand-dark transition-colors">Find Someone</Link>
                    <Link href="#" className="hover:text-brand-dark transition-colors">Become a Someone</Link>
                    <Link href="#" className="hover:text-brand-dark transition-colors">Safety</Link>
                    <Link href="#" className="hover:text-brand-dark transition-colors">About</Link>
                </div>
                {
                    // The right user action
                }
                <div className='flex items-center gap-4'>
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl p-5  border-gray-300">
                        <Avatar className="h-6 w-6 items-center flex justify-center">
                            <AvatarFallback className="bg-brand-violet text-white text-[12px]">A</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">Alex</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                    {/* Primary CTA */}
                    <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl p-5 font-medium">
                        Find Your Someone
                    </Button>
                </div>
            </div>
        </div >
    )
}