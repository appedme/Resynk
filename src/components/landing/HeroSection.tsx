"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Play, Star, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200 dark:border-blue-800 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Resume Builder</span>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">NEW</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Resynk
                        </span>
                        <br />
                        <span className="text-3xl md:text-4xl lg:text-5xl font-normal text-gray-700 dark:text-gray-300">
                            Your Career, Reimagined
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Create stunning, ATS-optimized resumes with our revolutionary AI-powered platform.
                        <span className="font-semibold text-gray-900 dark:text-white"> Get hired 3x faster</span> with resumes that actually work.
                    </p>

                    {/* Social Proof */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white dark:border-gray-900"></div>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">50,000+ professionals trust Resynk</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">4.9/5 rating</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Link href="/handler/sign-up">
                            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
                                Start Building Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <button className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2">
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Feature Highlights */}
                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>AI-Powered Content</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>ATS Optimization</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>50+ Templates</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Resume Preview */}
            <div className={`absolute right-10 top-1/2 transform -translate-y-1/2 hidden xl:block transition-all duration-1500 delay-1200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                <div className="relative">
                    <div className="w-64 h-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded mb-4"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                        <div className="h-3 bg-blue-100 dark:bg-blue-900 rounded mb-3"></div>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded"></div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-5/6"></div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded w-4/6"></div>
                        </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </section>
    );
}
