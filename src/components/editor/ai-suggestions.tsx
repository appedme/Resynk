"use client";

import { useState } from "react";
import { Sparkles, Lightbulb, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AISuggestionsProps {
    section: string;
    currentContent: string;
    onApplySuggestion: (suggestion: string) => void;
}

interface Suggestion {
    id: string;
    title: string;
    content: string;
    type: 'improvement' | 'alternative' | 'enhancement';
}

export function AISuggestions({ section, currentContent, onApplySuggestion }: AISuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Enhanced AI suggestions based on section and content analysis
    const generateSuggestions = async () => {
        setIsGenerating(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        let mockSuggestions: Suggestion[] = [];

        // Generate section-specific suggestions
        switch (section) {
            case 'personal-info':
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'Professional Summary Enhancement',
                        content: 'Consider adding a compelling 2-3 sentence professional summary that highlights your key strengths and career goals.',
                        type: 'enhancement'
                    },
                    {
                        id: '2',
                        title: 'Contact Information',
                        content: 'Ensure your LinkedIn URL is customized and your email address sounds professional.',
                        type: 'improvement'
                    },
                    {
                        id: '3',
                        title: 'Geographic Flexibility',
                        content: 'If open to remote work or relocation, consider indicating this in your location field.',
                        type: 'alternative'
                    }
                ];
                break;

            case 'experience':
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'STAR Method Application',
                        content: 'Structure descriptions using Situation, Task, Action, Result format. Start with the challenge, describe your actions, and end with quantified results.',
                        type: 'improvement'
                    },
                    {
                        id: '2',
                        title: 'Impact Metrics',
                        content: 'Add specific numbers: revenue generated, costs saved, performance improvements, team size managed, or project timelines.',
                        type: 'enhancement'
                    },
                    {
                        id: '3',
                        title: 'Technical Skills Integration',
                        content: 'Naturally weave relevant technologies and tools into your accomplishment descriptions rather than just listing them.',
                        type: 'improvement'
                    },
                    {
                        id: '4',
                        title: 'Leadership Examples',
                        content: 'Highlight instances of leadership, mentoring, or cross-functional collaboration to show soft skills.',
                        type: 'enhancement'
                    }
                ];
                break;

            case 'skills':
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'Skill Categorization',
                        content: 'Group skills by category (Programming Languages, Frameworks, Tools, Soft Skills) for better readability.',
                        type: 'improvement'
                    },
                    {
                        id: '2',
                        title: 'Relevance Prioritization',
                        content: 'Order skills by relevance to your target role. Put the most important skills first.',
                        type: 'enhancement'
                    },
                    {
                        id: '3',
                        title: 'Proficiency Levels',
                        content: 'Consider adding proficiency levels (Beginner, Intermediate, Advanced, Expert) to give context.',
                        type: 'alternative'
                    }
                ];
                break;

            case 'education':
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'Relevant Coursework',
                        content: 'Include relevant coursework, projects, or thesis topics that align with your career goals.',
                        type: 'enhancement'
                    },
                    {
                        id: '2',
                        title: 'Academic Achievements',
                        content: 'Highlight honors, awards, scholarships, or significant academic projects.',
                        type: 'improvement'
                    },
                    {
                        id: '3',
                        title: 'Continuing Education',
                        content: 'Add recent certifications, online courses, or professional development activities.',
                        type: 'alternative'
                    }
                ];
                break;

            case 'projects':
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'Technical Stack Details',
                        content: 'Clearly list the technologies, frameworks, and tools used in each project.',
                        type: 'improvement'
                    },
                    {
                        id: '2',
                        title: 'Project Impact',
                        content: 'Describe the problem solved, users impacted, or business value created by your project.',
                        type: 'enhancement'
                    },
                    {
                        id: '3',
                        title: 'Demo Links',
                        content: 'Include live demo links or GitHub repositories to showcase your work.',
                        type: 'enhancement'
                    }
                ];
                break;

            default:
                mockSuggestions = [
                    {
                        id: '1',
                        title: 'Content Optimization',
                        content: 'Ensure content is concise, relevant, and tailored to your target role.',
                        type: 'improvement'
                    },
                    {
                        id: '2',
                        title: 'ATS Optimization',
                        content: 'Use industry-standard keywords and avoid complex formatting that might not parse well.',
                        type: 'enhancement'
                    }
                ];
        }

        // Add general suggestions based on content analysis
        if (currentContent) {
            if (currentContent.length < 50) {
                mockSuggestions.push({
                    id: 'content-length',
                    title: 'Expand Content',
                    content: 'This section seems brief. Consider adding more detail to better showcase your qualifications.',
                    type: 'improvement'
                });
            }

            if (!/\d/.test(currentContent)) {
                mockSuggestions.push({
                    id: 'add-metrics',
                    title: 'Add Quantifiable Results',
                    content: 'Include specific numbers, percentages, or metrics to make your accomplishments more compelling.',
                    type: 'enhancement'
                });
            }
        }

        setSuggestions(mockSuggestions);
        setIsGenerating(false);
    };

    const handleCopy = async (suggestion: Suggestion) => {
        await navigator.clipboard.writeText(suggestion.content);
        setCopiedId(suggestion.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getBadgeColor = (type: Suggestion['type']) => {
        switch (type) {
            case 'improvement':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'enhancement':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'alternative':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        AI Suggestions
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateSuggestions}
                        disabled={isGenerating}
                        className="gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get AI-powered suggestions for your {section} section
                </p>
            </CardHeader>

            <CardContent>
                {suggestions.length === 0 && !isGenerating && (
                    <div className="text-center py-8">
                        <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Click "Generate" to get AI-powered suggestions for improving your resume content.
                        </p>
                    </div>
                )}

                {isGenerating && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Analyzing your content and generating suggestions...
                        </p>
                    </div>
                )}

                {suggestions.length > 0 && (
                    <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                            {suggestions.map((suggestion, index) => (
                                <div key={suggestion.id}>
                                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                                                <Badge className={getBadgeColor(suggestion.type)}>
                                                    {suggestion.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {suggestion.content}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(suggestion)}
                                                className="h-8 w-8 p-0"
                                            >
                                                {copiedId === suggestion.id ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onApplySuggestion(suggestion.content)}
                                                className="text-xs px-2 h-8"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                    {index < suggestions.length - 1 && <Separator className="my-2" />}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
