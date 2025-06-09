"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, Users, FileText, Award } from "lucide-react";

export function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({
        users: 0,
        resumes: 0,
        interviews: 0,
        success: 0
    });
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

    useEffect(() => {
        if (isVisible) {
            const finalCounts = {
                users: 50000,
                resumes: 125000,
                interviews: 75000,
                success: 94
            };
            
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepDuration = duration / steps;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                const progress = step / steps;
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                setCounts({
                    users: Math.floor(finalCounts.users * easeOutQuart),
                    resumes: Math.floor(finalCounts.resumes * easeOutQuart),
                    interviews: Math.floor(finalCounts.interviews * easeOutQuart),
                    success: Math.floor(finalCounts.success * easeOutQuart)
                });

                if (step >= steps) {
                    clearInterval(timer);
                    setCounts(finalCounts);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isVisible]);

    const stats = [
        {
            icon: Users,
            label: "Active Users",
            value: counts.users.toLocaleString(),
            suffix: "+",
            description: "Professionals building their careers",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: FileText,
            label: "Resumes Created",
            value: counts.resumes.toLocaleString(),
            suffix: "+",
            description: "Professional resumes generated",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: TrendingUp,
            label: "Interviews Landed",
            value: counts.interviews.toLocaleString(),
            suffix: "+",
            description: "Job interviews secured",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Award,
            label: "Success Rate",
            value: counts.success,
            suffix: "%",
            description: "Users who get interviews",
            color: "from-orange-500 to-red-500"
        }
    ];

    return (
        <section id="stats" ref={sectionRef} className="py-20 bg-white dark:bg-gray-900 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:50px_50px] opacity-30"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Trusted by Professionals
                        <span className="block text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-400 mt-2">
                            Worldwide
                        </span>
                    </h2>
                    <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Join thousands of successful professionals who have transformed their careers with Resynk
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`relative group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${300 + index * 100}ms` }}
                        >
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-gray-200 dark:group-hover:border-gray-600">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Number */}
                                <div className="mb-2">
                                    <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </span>
                                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                                        {stat.suffix}
                                    </span>
                                </div>

                                {/* Label */}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {stat.label}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.description}
                                </p>

                                {/* Hover Effect */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        Ready to join our growing community of successful professionals?
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Start Your Success Story
                    </button>
                </div>
            </div>
        </section>
    );
}
