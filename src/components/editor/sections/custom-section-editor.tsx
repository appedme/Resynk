"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomSection {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'list' | 'table';
    order: number;
}

interface CustomSectionEditorProps {
    customSections: CustomSection[];
    onChange: (customSections: CustomSection[]) => void;
}

export function CustomSectionEditor({ customSections, onChange }: CustomSectionEditorProps) {
    const addCustomSection = () => {
        const newSection: CustomSection = {
            id: crypto.randomUUID(),
            title: "",
            content: "",
            type: "text",
            order: customSections.length,
        };

        onChange([...customSections, newSection]);
    };

    const updateCustomSection = (id: string, field: keyof CustomSection, value: string | number) => {
        const updatedSections = customSections.map((section) =>
            section.id === id ? { ...section, [field]: value } : section
        );

        onChange(updatedSections);
    };

    const removeCustomSection = (id: string) => {
        const filteredSections = customSections.filter((section) => section.id !== id);
        onChange(filteredSections);
    };

    const formatPlaceholder = (type: 'text' | 'list' | 'table') => {
        switch (type) {
            case 'text':
                return "Add your custom content here...";
            case 'list':
                return "• First item\n• Second item\n• Third item";
            case 'table':
                return "Skill | Level\nJavaScript | Expert\nReact | Advanced\nNode.js | Intermediate";
            default:
                return "Add your custom content here...";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Sections</h3>
                <Button onClick={addCustomSection} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                </Button>
            </div>

            {customSections.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="mb-2">No custom sections yet</div>
                    <div className="text-sm">Add custom sections to highlight unique aspects of your background</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {customSections.map((section) => (
                        <Card key={section.id} className="border border-gray-200 dark:border-gray-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Custom Section</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCustomSection(section.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor={`title-${section.id}`} className="text-sm font-medium">
                                        Section Title *
                                    </Label>
                                    <Input
                                        id={`title-${section.id}`}
                                        value={section.title}
                                        onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                        placeholder="e.g., Publications, Volunteer Work, Interests"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`type-${section.id}`} className="text-sm font-medium">
                                        Content Type
                                    </Label>
                                    <Select
                                        value={section.type}
                                        onValueChange={(value: 'text' | 'list' | 'table') => updateCustomSection(section.id, 'type', value)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Paragraph Text</SelectItem>
                                            <SelectItem value="list">Bullet List</SelectItem>
                                            <SelectItem value="table">Table Format</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor={`content-${section.id}`} className="text-sm font-medium">
                                        Content *
                                    </Label>
                                    <Textarea
                                        id={`content-${section.id}`}
                                        value={section.content}
                                        onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                                        placeholder={formatPlaceholder(section.type)}
                                        rows={6}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {section.type === 'list' && "Use • for bullet points"}
                                        {section.type === 'table' && "Use | to separate columns and new lines for rows"}
                                        {section.type === 'text' && "Write paragraph content"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
