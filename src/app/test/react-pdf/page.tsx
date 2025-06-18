"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import type { ResumeData } from '@/types/resume';
import { toast } from 'sonner';

const sampleResume: ResumeData = {
    personal: {
        full_name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        linkedin: "https://linkedin.com/in/johndoe"
    },
    summary: "Experienced software engineer with 5+ years developing scalable web applications. Passionate about creating user-friendly interfaces and solving complex technical challenges. Proven track record of leading cross-functional teams and delivering high-quality products on time.",
    experience: [
        {
            position: "Senior Software Engineer",
            company: "TechCorp Inc.",
            start_date: "2022-01",
            end_date: null,
            is_current: true,
            location: "San Francisco, CA",
            description: "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored 3 junior developers and conducted technical interviews."
        },
        {
            position: "Full Stack Developer",
            company: "StartupXYZ",
            start_date: "2020-06",
            end_date: "2021-12",
            is_current: false,
            location: "Remote",
            description: "Built customer-facing web application from scratch using React and Express.js. Integrated payment processing with Stripe API. Optimized database queries resulting in 40% performance improvement."
        }
    ],
    education: [
        {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of California, Berkeley",
            start_date: "2016-08",
            end_date: "2020-05",
            gpa: "3.8"
        }
    ],
    skills: [
        { name: "JavaScript", level: "expert" },
        { name: "TypeScript", level: "expert" },
        { name: "React", level: "expert" },
        { name: "Node.js", level: "advanced" },
        { name: "Python", level: "intermediate" },
        { name: "AWS", level: "intermediate" }
    ]
};

export default function ReactPDFTestPage() {
    const [isGenerating, setIsGenerating] = useState(false);

    const testPDFGeneration = async () => {
        setIsGenerating(true);
        try {
            console.log('Starting PDF generation with sample data:', sampleResume);
            
            const pdfBlob = await generatePDF(sampleResume);
            console.log('PDF generated successfully, blob size:', pdfBlob.size);

            // Download the PDF
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test-resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('PDF generated successfully!', {
                description: `Generated PDF with size: ${(pdfBlob.size / 1024).toFixed(1)} KB`
            });
        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.error('PDF generation failed', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">React-PDF Test</h1>
                    <p className="text-xl text-gray-600">
                        Test the React-PDF library directly with sample data
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            PDF Generation Test
                        </CardTitle>
                        <CardDescription>
                            This will test the React-PDF library with hardcoded sample data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={testPDFGeneration}
                            disabled={isGenerating}
                            className="w-full"
                            size="lg"
                        >
                            {isGenerating ? 'Generating PDF...' : 'Generate Test PDF'}
                        </Button>

                        <div className="text-sm text-gray-600 space-y-2">
                            <p><strong>Sample Data Includes:</strong></p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Personal Information: {sampleResume.personal.full_name}</li>
                                <li>Experience: {sampleResume.experience?.length || 0} jobs</li>
                                <li>Education: {sampleResume.education?.length || 0} degrees</li>
                                <li>Skills: {sampleResume.skills?.length || 0} skills</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Debugging Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-mono bg-gray-100 p-4 rounded space-y-2">
                            <div>Browser: {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</div>
                            <div>Platform: {typeof window !== 'undefined' ? navigator.platform : 'N/A'}</div>
                            <div>PDF Support: {typeof window !== 'undefined' && 'Blob' in window ? '✅' : '❌'}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
