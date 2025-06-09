"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export function FAQSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
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

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(item => item !== index)
                : [...prev, index]
        );
    };

    const faqs = [
        {
            question: "How does Resynk's AI-powered content generation work?",
            answer: "Our advanced AI analyzes your job experience, industry standards, and current market trends to suggest optimized content for your resume. It helps you write compelling bullet points, identify key achievements, and ensure your resume includes relevant keywords that ATS systems look for."
        },
        {
            question: "Is Resynk compatible with Applicant Tracking Systems (ATS)?",
            answer: "Yes! Resynk is specifically designed with ATS compatibility in mind. Our templates use clean formatting, proper heading structures, and standard fonts that ATS systems can easily parse. We also provide real-time ATS optimization scores to help you maximize your resume's compatibility."
        },
        {
            question: "Can I collaborate with others on my resume?",
            answer: "Absolutely! Our Professional plan includes real-time collaboration features. You can share your resume with mentors, career counselors, friends, or colleagues for feedback. Changes are synchronized instantly, and you can see who made what edits with our version history feature."
        },
        {
            question: "What file formats can I export my resume in?",
            answer: "Resynk supports multiple export formats including PDF (recommended for job applications), Microsoft Word (.docx), and we also provide shareable links with view analytics. Our exports are optimized for both digital viewing and printing."
        },
        {
            question: "How secure is my personal information?",
            answer: "We take security seriously. All your data is encrypted both in transit and at rest using bank-level security protocols. We're GDPR compliant and never share your personal information with third parties. You have complete control over your data and can delete your account at any time."
        },
        {
            question: "Can I create multiple resume versions?",
            answer: "Yes! With our Professional plan, you can create unlimited resume versions tailored for different job applications or industries. Each version can have different templates, content focus, and formatting while maintaining a centralized profile of your experiences."
        },
        {
            question: "Do you offer templates for different industries?",
            answer: "We have 50+ professionally designed templates optimized for various industries including technology, healthcare, finance, education, creative arts, and more. Each template follows industry best practices and can be fully customized to match your personal brand."
        },
        {
            question: "What's included in the free plan?",
            answer: "Our free plan includes access to basic resume templates, our core editor, PDF export, and community support. While it has some limitations like watermarks and fewer template options, it's perfect for getting started and experiencing our platform."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll retain access to premium features until the end of your billing period, and you can always downgrade to our free plan."
        },
        {
            question: "Do you offer customer support?",
            answer: "We provide comprehensive support through multiple channels. Free users get community support, Professional plan users receive priority email support, and Enterprise customers get dedicated account management. We also have extensive documentation and video tutorials."
        }
    ];

    return (
        <section ref={sectionRef} id="faq" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <HelpCircle className="w-4 h-4" />
                        <span>Frequently Asked Questions</span>
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Got Questions?
                        <span className="block text-2xl md:text-3xl font-normal text-gray-600 dark:text-gray-400 mt-2">
                            We've Got Answers
                        </span>
                    </h2>

                    <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Everything you need to know about Resynk and how it can transform your career
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${600 + index * 100}ms` }}
                        >
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                    {faq.question}
                                </span>
                                <div className="flex-shrink-0 ml-4">
                                    {openItems.includes(index) ? (
                                        <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${openItems.includes(index)
                                    ? 'max-h-96 opacity-100'
                                    : 'max-h-0 opacity-0'
                                } overflow-hidden`}>
                                <div className="px-6 pb-6">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Still Have Questions?
                        </h3>
                        <p className="text-blue-100 mb-6 text-lg">
                            Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                                Contact Support
                            </button>
                            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popular Resources */}
                <div className={`mt-16 transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Popular Resources
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <a href="#" className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Resume Writing Guide
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Complete guide to writing professional resumes that get results
                            </p>
                        </a>
                        <a href="#" className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                ATS Optimization Tips
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Learn how to make your resume ATS-friendly and get past automated screening
                            </p>
                        </a>
                        <a href="#" className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Video Tutorials
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Step-by-step video guides to master all Resynk features
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
