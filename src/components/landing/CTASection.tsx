"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Star, CheckCircle, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-white/15 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Sparkles className="w-4 h-4" />
                        <span>Join 50,000+ Successful Professionals</span>
                    </div>

                    {/* Main Headline */}
                    <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Ready to Transform
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Your Career?
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className={`text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Start building your professional resume today with our AI-powered platform.
                        <span className="font-semibold text-white"> No credit card required.</span>
                    </p>

                    {/* Stats Grid */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="w-6 h-6 text-blue-200 mr-2" />
                                <span className="text-3xl font-bold text-white">50K+</span>
                            </div>
                            <p className="text-blue-200 text-sm">Active Users</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-6 h-6 text-yellow-300 mr-2" />
                                <span className="text-3xl font-bold text-white">4.9</span>
                            </div>
                            <p className="text-blue-200 text-sm">User Rating</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="w-6 h-6 text-green-300 mr-2" />
                                <span className="text-3xl font-bold text-white">94%</span>
                            </div>
                            <p className="text-blue-200 text-sm">Success Rate</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
                                <span className="text-3xl font-bold text-white">75K+</span>
                            </div>
                            <p className="text-blue-200 text-sm">Interviews</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Link href="/editor">
                            <button className="group bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 flex items-center gap-3 min-w-[280px] justify-center">
                                Start Building Free
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <button className="group border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center gap-3 min-w-[280px] justify-center">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                            </svg>
                            Watch 2-Min Demo
                        </button>
                    </div>

                    {/* Features Highlight */}
                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center justify-center gap-3 text-blue-100">
                            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                            <span className="text-sm">Free forever plan</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-blue-100">
                            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                            <span className="text-sm">No credit card required</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-blue-100">
                            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                            <span className="text-sm">AI-powered optimization</span>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className={`text-center transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <p className="text-blue-200 mb-6">
                            Trusted by professionals at top companies worldwide
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                            {/* Company logos would go here - using text placeholders */}
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <span className="text-white font-semibold">Google</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <span className="text-white font-semibold">Microsoft</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <span className="text-white font-semibold">Amazon</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <span className="text-white font-semibold">Meta</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                                <span className="text-white font-semibold">Apple</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative element */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
        </section>
    );
}
