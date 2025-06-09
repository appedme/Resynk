"use client";

import { useState, useEffect, useRef } from "react";
import {
    BookOpen,
    Target,
    Lightbulb,
    CheckCircle,
    ArrowRight,
    Users,
    Star,
    TrendingUp,
    Award,
    Briefcase,
    FileText,
    Zap
} from "lucide-react";

export function UserGuideSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeGuide, setActiveGuide] = useState(0);
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

    // Auto-rotate guide items
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveGuide((prev) => (prev + 1) % 4);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const guides = [
        {
            icon: Target,
            title: "Define Your Target Role",
            description: "Start by clearly identifying the specific position and industry you're targeting.",
            tips: [
                "Research job descriptions for keywords",
                "Understand required skills and qualifications",
                "Identify company culture and values",
                "Note preferred experience levels"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Briefcase,
            title: "Structure Your Experience",
            description: "Organize your work history to tell a compelling career story.",
            tips: [
                "Use reverse chronological order",
                "Focus on achievements, not just duties",
                "Quantify results with numbers and metrics",
                "Highlight relevant skills and technologies"
            ],
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Lightbulb,
            title: "Craft Compelling Content",
            description: "Write impactful bullet points that showcase your value proposition.",
            tips: [
                "Start with strong action verbs",
                "Include specific metrics and outcomes",
                "Show progression and growth",
                "Align with job requirements"
            ],
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Zap,
            title: "Optimize for ATS",
            description: "Ensure your resume passes automated screening systems.",
            tips: [
                "Use standard section headings",
                "Include relevant keywords naturally",
                "Avoid complex formatting",
                "Save in PDF format when possible"
            ],
            color: "from-orange-500 to-red-500"
        }
    ];

    const bestPractices = [
        {
            category: "Content Strategy",
            icon: FileText,
            practices: [
                "Tailor each resume to the specific job application",
                "Keep content concise - aim for 1-2 pages maximum",
                "Use industry-specific terminology and keywords",
                "Focus on the most recent and relevant 10-15 years of experience"
            ]
        },
        {
            category: "Design Principles",
            icon: Star,
            practices: [
                "Maintain consistent formatting throughout",
                "Use plenty of white space for readability",
                "Choose professional, easy-to-read fonts",
                "Ensure high contrast between text and background"
            ]
        },
        {
            category: "Professional Language",
            icon: Award,
            practices: [
                "Write in active voice rather than passive",
                "Avoid personal pronouns (I, me, my)",
                "Use present tense for current roles, past tense for previous",
                "Eliminate filler words and redundant phrases"
            ]
        }
    ];

    const terminology = [
        { term: "ATS", definition: "Applicant Tracking System - software that scans and filters resumes before human review" },
        { term: "Keywords", definition: "Industry-specific terms and skills that match job requirements" },
        { term: "Value Proposition", definition: "A clear statement of the unique value you bring to an employer" },
        { term: "Action Verbs", definition: "Strong verbs that begin bullet points (e.g., 'Led', 'Developed', 'Increased')" },
        { term: "Quantifiable Results", definition: "Measurable outcomes that demonstrate your impact (percentages, dollar amounts, etc.)" },
        { term: "Professional Summary", definition: "A brief overview of your key qualifications and career objectives" }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className={`inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <BookOpen className="w-4 h-4" />
                        <span>Professional Resume Guide</span>
                    </div>

                    <h2 className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Master the Art of
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Resume Building
                        </span>
                    </h2>

                    <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Learn professional best practices, industry terminology, and proven strategies to create resumes that get results
                    </p>
                </div>

                {/* Interactive Guide Steps */}
                <div className="mb-24">
                    <h3 className={`text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        4-Step Success Framework
                    </h3>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Guide Navigation */}
                        <div className={`space-y-4 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                            {guides.map((guide, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer transition-all duration-500 ${activeGuide === index
                                            ? 'bg-white dark:bg-gray-800 shadow-xl border-l-4 border-blue-500 scale-105'
                                            : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg'
                                        } p-6 rounded-xl`}
                                    onClick={() => setActiveGuide(index)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${activeGuide === index
                                                ? `bg-gradient-to-r ${guide.color} text-white shadow-lg`
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            <guide.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeGuide === index
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                                    }`}>
                                                    {index + 1}
                                                </span>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {guide.title}
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                                {guide.description}
                                            </p>
                                            {activeGuide === index && (
                                                <div className="space-y-2 animate-fadeIn">
                                                    {guide.tips.map((tip, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                            {tip}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Guide Visualization */}
                        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${guides[activeGuide].color} flex items-center justify-center shadow-lg`}>
                                    <guides[activeGuide].icon className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                                    {guides[activeGuide].title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                                    {guides[activeGuide].description}
                                </p>
                                <div className="space-y-3">
                                    {guides[activeGuide].tips.map((tip, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best Practices Grid */}
                <div className="mb-24">
                    <h3 className={`text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Professional Best Practices
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {bestPractices.map((section, index) => (
                            <div
                                key={index}
                                className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 dark:border-gray-700 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${1400 + index * 200}ms` }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <section.icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    {section.category}
                                </h4>
                                <ul className="space-y-3">
                                    {section.practices.map((practice, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {practice}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Professional Terminology */}
                <div className="mb-16">
                    <h3 className={`text-3xl font-bold text-gray-900 dark:text-white text-center mb-12 transition-all duration-1000 delay-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Essential Resume Terminology
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {terminology.map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${2200 + index * 100}ms` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                            {item.term.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {item.term}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.definition}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className={`text-center transition-all duration-1000 delay-2800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h3 className="text-3xl font-bold mb-4">
                            Ready to Apply These Strategies?
                        </h3>
                        <p className="text-blue-100 mb-6 text-lg">
                            Put your knowledge into practice with our AI-powered resume builder
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                            Start Building Your Resume
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
        </section>
    );
}
