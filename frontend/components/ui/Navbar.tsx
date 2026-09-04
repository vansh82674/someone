'use client'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from 'react';

export default function Navbar() {
    // For responsive navbar
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
                {
                    // The Mobile Menu Trigger
                }
                <div className="flex md:hidden items-center gap-4">
                    <Avatar className="h-8 w-8 items-center flex justify-center bg-brand-violet text-white">
                        <span className="text-xs font-bold">A</span>
                    </Avatar>
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </button>
                </div>

                {
                    // The Mobile Dropdown Menu
                }
                {isMobileMenuOpen && (
                    <div className="absolute top-0 left-0 w-full bg-brand-cream/95 backdrop-blur-xl p-6 pb-8 rounded-b-3xl shadow-2xl flex flex-col gap-8 md:hidden z-50 animate-in slide-in-from-top-4 fade-in duration-300">
                        {/* Top row with Logo and X close button */}
                        <div className="flex items-center justify-between">
                            <div className="font-heading font-black text-xl tracking-widest text-brand-dark cursor-pointer flex items-center">
                                S<BrandGlyph />MEONE
                            </div>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-8 w-8 items-center flex justify-center bg-brand-violet text-white">
                                    <span className="text-xs font-bold">A</span>
                                </Avatar>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-dark/10 hover:bg-brand-dark/20 transition-colors p-2 rounded-full">
                                    <X className="w-5 h-5 text-brand-dark" strokeWidth={2} />
                                </button>
                            </div>
                        </div>

                        {/* Your Links stacked vertically */}
                        <div className="flex flex-col gap-6 text-lg font-semibold text-brand-dark/80 mt-2 px-2">
                            <Link href="#" className="hover:text-brand-dark">How It Works</Link>
                            <Link href="#" className="hover:text-brand-dark">Find Someone</Link>
                            <Link href="#" className="hover:text-brand-dark">Become a Someone</Link>
                            <Link href="#" className="hover:text-brand-dark">Safety</Link>
                            <Link href="#" className="hover:text-brand-dark">About</Link>
                            
                            <div className="flex items-center gap-3 text-brand-dark mt-4 cursor-pointer hover:opacity-80">
                                <LayoutDashboard className="w-5 h-5 text-brand-violet" /> My Dashboard
                            </div>
                        </div>

                        {/* The Action Buttons */}
                        <div className="flex flex-col gap-4 mt-4">
                            <Button variant="outline" className="w-full rounded-xl py-6 text-brand-dark/80 font-bold border-brand-violet/20 bg-brand-violet/5 hover:bg-brand-violet/10">
                                Log Out (Alex)
                            </Button>
                            <Button className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl py-6 font-bold">
                                Find Your Someone
                            </Button>
                        </div>
                    </div>
                )}

                {
                    // The Desktop Right Action
                }
                <div className='hidden md:flex items-center gap-4'>
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl p-5 border-gray-300 hover:bg-gray-50 transition-colors">
                        <Avatar className="h-6 w-6 items-center flex justify-center">
                            <AvatarFallback className="bg-brand-violet text-white text-[12px] font-bold">A</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">Alex</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl p-5 font-bold shadow-lg shadow-brand-violet/20 transition-all hover:-translate-y-0.5">
                        Find Your Someone
                    </Button>
                </div>
            </div>
        </div >
    )
}