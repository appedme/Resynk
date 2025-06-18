"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { useUser } from '@stackframe/stack';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const user = useUser();

    // User state will reactively update when authentication changes
    const isLoggedIn = !!user;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Resynk</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Features
                        </Link>
                        <Link href="/ats-calculator" className="text-gray-600 hover:text-gray-900 transition-colors">
                            ATS Scanner
                        </Link>
                        <Link href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Templates
                        </Link>
                        <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Pricing
                        </Link>
                        <Link href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                            FAQ
                        </Link>
                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/handler/sign-in"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/handler/sign-up"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            <Link
                                href="#features"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#templates"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Templates
                            </Link>
                            <Link
                                href="#pricing"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="#faq"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                FAQ
                            </Link>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/handler/sign-in"
                                            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/handler/sign-up"
                                            className="block px-3 py-2 mt-2 text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:shadow-lg transition-all duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
