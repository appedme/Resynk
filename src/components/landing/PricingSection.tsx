"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Star, Crown, Zap, Shield } from "lucide-react";

export function PricingSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnnual, setIsAnnual] = useState(true);
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

    const plans = [
        {
            name: "Free",
            description: "Perfect for getting started",
            icon: Star,
            price: { monthly: 0, annual: 0 },
            color: "from-gray-400 to-gray-600",
            features: [
                "1 resume template",
                "Basic editor",
                "PDF export",
                "Community support",
                "Basic ATS optimization"
            ],
            limitations: [
                "Limited to 1 resume",
                "Watermark on downloads",
                "Basic templates only"
            ],
            popular: false,
            cta: "Get Started Free"
        },
        {
            name: "Professional",
            description: "Best for job seekers",
            icon: Zap,
            price: { monthly: 19, annual: 15 },
            color: "from-blue-500 to-indigo-600",
            features: [
                "50+ premium templates",
                "AI-powered content suggestions",
                "Advanced ATS optimization",
                "Multiple resume versions",
                "Custom sections",
                "Cover letter builder",
                "LinkedIn optimization",
                "Priority support",
                "Version history",
                "Analytics dashboard"
            ],
            limitations: [],
            popular: true,
            cta: "Start Free Trial"
        },
        {
            name: "Enterprise",
            description: "For teams and organizations",
            icon: Crown,
            price: { monthly: 49, annual: 39 },
            color: "from-purple-500 to-pink-600",
            features: [
                "Everything in Professional",
                "Team collaboration",
                "Custom branding",
                "Bulk operations",
                "API access",
                "SSO integration",
                "Advanced analytics",
                "Dedicated account manager",
                "Custom integrations",
                "White-label options"
            ],
            limitations: [],
            popular: false,
            cta: "Contact Sales"
        }
    ];

    return (
        <section id="pricing" ref={sectionRef} className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.1)_1px,transparent_0)] [background-size:40px_40px]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Simple, Transparent
                        <span className="block text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-400 mt-2">
                            Pricing
                        </span>
                    </h2>
                    <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Choose the perfect plan for your career goals. Start free and upgrade as you grow.
                    </p>

                    {/* Billing Toggle */}
                    <div className={`flex items-center justify-center gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isAnnual ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-all duration-300 ${isAnnual ? 'left-8' : 'left-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            Annual
                        </span>
                        {isAnnual && (
                            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                                Save 20%
                            </span>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`relative group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${plan.popular ? 'scale-105 lg:scale-110' : ''
                                }`}
                            style={{ transitionDelay: `${600 + index * 150}ms` }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border-2 ${plan.popular
                                ? 'border-blue-500 dark:border-blue-400'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                } h-full flex flex-col`}>
                                {/* Plan Header */}
                                <div className="text-center mb-8">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                                        <plan.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Pricing */}
                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                            ${isAnnual ? plan.price.annual : plan.price.monthly}
                                        </span>
                                        <div className="text-left">
                                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                                per month
                                            </div>
                                            {isAnnual && plan.price.annual > 0 && (
                                                <div className="text-green-600 dark:text-green-400 text-xs">
                                                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {plan.name === "Free" && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Forever free
                                        </p>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="flex-1 mb-8">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.limitations.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                Limitations:
                                            </h4>
                                            <ul className="space-y-2">
                                                {plan.limitations.map((limitation, i) => (
                                                    <li key={i} className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                            {limitation}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <button
                                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {plan.cta}
                                </button>

                                {/* Background Gradient */}
                                {plan.popular && (
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 pointer-events-none" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Cancel anytime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span>4.9/5 customer satisfaction</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Teaser */}
                <div className={`text-center mt-12 transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-gray-600 dark:text-gray-400">
                        Have questions? Check out our{" "}
                        <a href="#faq" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            frequently asked questions
                        </a>
                        {" "}or{" "}
                        <a href="#contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            contact our team
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
