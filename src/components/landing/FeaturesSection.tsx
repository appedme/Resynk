"use client";

import { useState, useEffect, useRef } from "react";
import {
    Brain,
    Users,
    Zap,
    Shield,
    Download,
    Eye,
    Palette,
    Target,
    Clock,
    Globe
} from "lucide-react";

export function FeaturesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
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

    // Auto-rotate featured items
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const primaryFeatures = [
        {
            icon: Brain,
            title: "AI-Powered Content Generation",
            description: "Smart suggestions and content optimization powered by advanced AI to make your resume stand out from the competition.",
            image: "/api/placeholder/400/300",
            highlights: ["Smart bullet points", "Industry keywords", "Achievement metrics", "Tone optimization"]
        },
        {
            icon: Zap,
            title: "Real-Time Live Preview",
            description: "See your changes instantly with our split-screen editor and real-time preview functionality for seamless editing.",
            image: "/api/placeholder/400/300",
            highlights: ["Instant updates", "Multiple formats", "Mobile preview", "Print optimization"]
        },
        {
            icon: Target,
            title: "ATS Optimization Engine",
            description: "Built-in ATS scanner ensures your resume passes through applicant tracking systems used by 95% of companies.",
            image: "/api/placeholder/400/300",
            highlights: ["ATS compatibility", "Keyword optimization", "Format validation", "Score tracking"]
        }
    ];

    const additionalFeatures = [
        {
            icon: Palette,
            title: "50+ Professional Templates",
            description: "Industry-specific templates designed by professionals for maximum impact.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Users,
            title: "Real-time Collaboration",
            description: "Work with mentors, career counselors, or teammates on your resume simultaneously.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level encryption with full control over privacy settings and data sharing.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Download,
            title: "Multiple Export Formats",
            description: "Export to PDF, Word, or share via custom links with tracking analytics.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Clock,
            title: "Version History",
            description: "Never lose your work with automatic saving and comprehensive version control.",
            color: "from-indigo-500 to-blue-500"
        },
        {
            icon: Globe,
            title: "Global Localization",
            description: "Support for multiple languages and regional resume formats worldwide.",
            color: "from-teal-500 to-green-500"
        }
    ];

    return (
        <section id="features" ref={sectionRef} className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Revolutionary Features
                        <span className="block text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-400 mt-2">
                            Built for Modern Professionals
                        </span>
                    </h2>
                    <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Experience the future of resume building with cutting-edge AI technology and professional design tools
                    </p>
                </div>

                {/* Primary Features Showcase */}
                <div className="mb-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Feature Content */}
                        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                            <div className="space-y-8">
                                {primaryFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer transition-all duration-500 ${activeFeature === index
                                                ? 'bg-white dark:bg-gray-800 shadow-xl border-l-4 border-blue-500'
                                                : 'bg-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'
                                            } p-6 rounded-xl`}
                                        onClick={() => setActiveFeature(index)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${activeFeature === index
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                <feature.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                    {feature.description}
                                                </p>
                                                {activeFeature === index && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {feature.highlights.map((highlight, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                                                <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                                                                {highlight}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feature Visualization */}
                        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="relative">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center mb-6">
                                        {(() => {
                                            const IconComponent = primaryFeatures[activeFeature].icon;
                                            return <IconComponent className="w-24 h-24 text-blue-600 dark:text-blue-400" />;
                                        })()}
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {primaryFeatures[activeFeature].title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {primaryFeatures[activeFeature].description}
                                    </p>
                                </div>
                                {/* Floating indicators */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {additionalFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className={`group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${600 + index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover overlay */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-20 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                        <h3 className="text-3xl font-bold mb-4">
                            Experience the Difference
                        </h3>
                        <p className="text-xl mb-6 text-blue-100">
                            Join 50,000+ professionals who have transformed their careers with Resynk
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Try All Features Free
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
