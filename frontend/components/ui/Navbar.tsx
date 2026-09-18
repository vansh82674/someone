'use client'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { ChevronDown, Menu, X, LayoutDashboard, Sparkles, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const BrandGlyph = () => (
        <svg viewBox="0 0 100 100" className="w-7 h-7 md:w-6 md:h-6 inline-block mx-px -mt-1">
            <path d="M 50 16 A 34 34 0 0 0 18 60 C 22 74, 36 84, 50 84 C 42 72, 40 58, 45 46 C 47 40, 50 28, 50 16 Z" className="fill-brand-violet" />
            <path d="M 50 84 A 34 34 0 0 0 82 40 C 78 26, 64 16, 50 16 C 58 28, 60 42, 55 54 C 53 60, 50 72, 50 84 Z" className="fill-brand-violet opacity-80" />
            <circle cx="50" cy="50" r="8" className="fill-violet-300" />
        </svg>
    );

    return (
        <div className='sticky top-0 z-50 w-full border-b bg-brand-cream/70 backdrop-blur-md flex items-center justify-between px-6 py-4'>
            <div className='max-w-7xl mx-auto flex items-center justify-between w-full relative'>
                
                {/* Logo */}
                <Link href="/" className="font-heading font-black text-xl tracking-widest text-brand-dark cursor-pointer flex items-center">
                    S<BrandGlyph />MEONE
                </Link>

                {/* Middle Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-dark/70">
                    <Link href="/#how-it-works" className="hover:text-brand-dark transition-colors">How It Works</Link>
                    <Link href="/queue" className="hover:text-brand-dark transition-colors">Find Someone</Link>
                    <Link href="/become-someone" className="text-[13px] font-bold text-brand-dark hover:text-brand-violet transition-colors">
                        Become a Someone
                    </Link>
                    <Link href="/#safety" className="hover:text-brand-dark transition-colors">Safety</Link>
                    <Link href="/#about" className="hover:text-brand-dark transition-colors">About</Link>
                </div>

                {/* Mobile Menu Trigger */}
                <div className="flex md:hidden items-center gap-4">
                    {status === 'authenticated' && (
                        <Avatar className="h-8 w-8 items-center flex justify-center bg-brand-violet text-white">
                            <span className="text-xs font-bold">{session?.user?.name?.[0]?.toUpperCase() || 'U'}</span>
                        </Avatar>
                    )}
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-0 left-0 w-full bg-brand-cream/95 backdrop-blur-xl p-6 pb-8 rounded-b-3xl shadow-2xl flex flex-col gap-8 md:hidden z-50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-heading font-black text-xl tracking-widest text-brand-dark flex items-center">
                                    S<BrandGlyph />MEONE
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="bg-brand-dark/10 hover:bg-brand-dark/20 transition-colors p-2 rounded-full">
                                        <X className="w-5 h-5 text-brand-dark" strokeWidth={2} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 text-lg font-semibold text-brand-dark/80 mt-2 px-2">
                                <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-dark">How It Works</Link>
                                <Link href="/queue" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-dark">Find Someone</Link>
                                <Link href="/become-someone" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-dark">Become a Someone</Link>
                                <Link href="/#safety" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-dark">Safety</Link>
                                <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-dark">About</Link>
                                
                                {status === 'authenticated' && (
                                    <Link href="/dashboard" className="flex items-center gap-3 text-brand-dark mt-4 cursor-pointer hover:opacity-80">
                                        <LayoutDashboard className="w-5 h-5 text-brand-violet" /> My Dashboard
                                    </Link>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                {status === 'authenticated' ? (
                                    <>
                                        <Button onClick={() => signOut()} variant="outline" className="w-full rounded-xl py-6 text-red-600 font-bold border-red-200 bg-red-50 hover:bg-red-100">
                                            Log Out ({session?.user?.name})
                                        </Button>
                                        <Link href="/queue" className="w-full">
                                            <Button className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl py-6 font-bold">
                                                Find Your Someone
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/become-someone" 
                                            className="block text-sm font-bold text-brand-dark/80 hover:text-brand-dark transition-colors py-2"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Become a Someone
                                        </Link>
                                        <Link href="/login" className="w-full">
                                            <Button variant="outline" className="w-full rounded-xl py-6 text-brand-dark font-bold border-gray-300 bg-transparent hover:bg-gray-50">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link href="/signup" className="w-full">
                                            <Button className="w-full bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl py-6 font-bold">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Desktop Right Action */}
                <div className='hidden md:flex items-center gap-4 relative' ref={dropdownRef}>
                    {status === 'loading' ? (
                        <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-xl"></div>
                    ) : status === 'authenticated' ? (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 rounded-xl p-5 border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Avatar className="h-6 w-6 items-center flex justify-center">
                                    <AvatarFallback className="bg-brand-violet text-white text-[12px] font-bold">
                                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{session?.user?.name}</span>
                                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {/* Dropdown Modal */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-14 right-48 w-64 bg-white rounded-3xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden flex flex-col z-50"
                                    >
                                        <div className="p-5 pb-4 border-b border-gray-100">
                                            <p className="text-xs font-semibold text-gray-400 mb-1">Logged in as</p>
                                            <p className="font-bold text-brand-dark text-lg leading-tight">{session?.user?.name}</p>
                                            <p className="text-xs font-medium text-brand-violet mt-1 tracking-wide">ID: {(session?.user as any)?.anonId || 'anon-0000'}</p>
                                        </div>
                                        
                                        <div className="p-2 flex flex-col gap-1 border-b border-gray-100">
                                            <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-brand-dark font-medium text-sm">
                                                    <LayoutDashboard className="w-5 h-5 text-brand-violet" /> My Dashboard
                                                </div>
                                            </Link>
                                            <Link href="/queue" onClick={() => setIsDropdownOpen(false)}>
                                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-brand-dark font-medium text-sm">
                                                    <Sparkles className="w-5 h-5 text-gray-600" /> Find Someone
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="p-2">
                                            <div 
                                                onClick={() => signOut()}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer text-red-600 font-medium text-sm"
                                            >
                                                <LogOut className="w-5 h-5" /> Log Out
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Link href="/queue">
                                <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl p-5 font-bold shadow-lg shadow-brand-violet/20 transition-all hover:-translate-y-0.5">
                                    Find Your Someone
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="font-bold text-brand-dark/70 hover:text-brand-dark">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white rounded-xl p-5 font-bold shadow-lg shadow-brand-violet/20 transition-all hover:-translate-y-0.5">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}