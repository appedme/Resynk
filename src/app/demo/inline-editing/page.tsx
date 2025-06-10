"use client";

import { useState } from "react";
import { ResumePreview } from "@/components/editor/resume-preview";
import type { EditorResume } from "@/lib/data-converter";
import { Toaster } from "sonner";

export default function InlineEditingDemoPage() {
    const [demoResume, setDemoResume] = useState<EditorResume>({
        id: "demo-resume",
        title: "Inline Editing Demo Resume",
        template: "modern",
        personalInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            website: "johndoe.dev",
            linkedin: "linkedin.com/in/johndoe",
            summary: "Experienced software engineer with 5+ years of experience building web applications and leading development teams."
        },
        experience: [
            {
                id: "exp1",
                position: "Senior Software Engineer",
                company: "Tech Company Inc",
                startDate: "2022-01",
                endDate: "",
                current: true,
                location: "San Francisco, CA",
                description: "Lead a team of 4 developers building scalable web applications using React, Node.js, and AWS.",
                technologies: ["React", "Node.js", "AWS", "TypeScript"]
            },
            {
                id: "exp2",
                position: "Software Engineer",
                company: "Startup Co",
                startDate: "2020-06",
                endDate: "2021-12",
                current: false,
                location: "Remote",
                description: "Developed full-stack web applications and improved system performance by 40%.",
                technologies: ["Vue.js", "Python", "PostgreSQL"]
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "Bachelor of Science in Computer Science",
                institution: "University of California, Berkeley",
                startDate: "2016-08",
                endDate: "2020-05",
                location: "Berkeley, CA",
                gpa: "3.7"
            }
        ],
        skills: [
            { id: "skill1", name: "JavaScript", level: "expert" },
            { id: "skill2", name: "React", level: "expert" },
            { id: "skill3", name: "Node.js", level: "advanced" },
            { id: "skill4", name: "TypeScript", level: "advanced" },
            { id: "skill5", name: "AWS", level: "intermediate" }
        ],
        projects: [
            {
                id: "proj1",
                name: "Task Management App",
                description: "A full-stack task management application with real-time collaboration features.",
                url: "https://taskapp.demo.com",
                startDate: "2023-01",
                endDate: "2023-06",
                technologies: ["React", "Node.js", "Socket.io", "MongoDB"]
            }
        ],
        certifications: [],
        languages: [],
        awards: [],
        customSections: [],
        settings: {
            fontSize: 12,
            fontFamily: "Inter",
            primaryColor: "#3B82F6",
            secondaryColor: "#64748B",
            spacing: "normal",
            pageMargins: "normal"
        },
        metadata: {
            atsScore: 85,
            lastModified: new Date(),
            version: 1,
            isPublic: false,
            tags: ["software", "engineering", "react"]
        }
    });

    const handleResumeUpdate = (updatedResume: EditorResume) => {
        setDemoResume(updatedResume);
        console.log("Resume updated:", updatedResume);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Inline Editing Demo
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Click on any text in the resume preview below to edit it directly!
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h2 className="text-lg font-semibold text-blue-900 mb-2">How to use:</h2>
                        <ul className="text-blue-800 text-left space-y-1">
                            <li>• Click on any text to start editing</li>
                            <li>• Press Enter to save changes</li>
                            <li>• Press Escape to cancel editing</li>
                            <li>• Hover over elements to see edit indicators</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Resume Preview</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDemoResume({ ...demoResume, template: "modern" })}
                                className={`px-3 py-1 rounded text-sm ${demoResume.template === "modern" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                Modern
                            </button>
                            <button
                                onClick={() => setDemoResume({ ...demoResume, template: "professional" })}
                                className={`px-3 py-1 rounded text-sm ${demoResume.template === "professional" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                Professional
                            </button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <ResumePreview
                            resume={demoResume}
                            zoom={100}
                            mode="desktop"
                            template={demoResume.template}
                            onResumeUpdate={handleResumeUpdate}
                            isInlineEditingEnabled={true}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Resume Data</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                        {JSON.stringify(demoResume, null, 2)}
                    </pre>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
