"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomSection {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'list' | 'table';
    order: number;
}

interface AddCustomSectionDialogProps {
    onAdd: (section: Omit<CustomSection, 'id' | 'order'>) => void;
    existingSectionCount: number;
}

export function AddCustomSectionDialog({ onAdd, existingSectionCount }: AddCustomSectionDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<'text' | 'list' | 'table'>('text');

    const predefinedSections = [
        { title: "Publications", type: 'list' as const, placeholder: "• Research Paper Title, Journal Name (Year)\n• Another Publication, Conference Name (Year)" },
        { title: "Volunteer Work", type: 'list' as const, placeholder: "• Organization Name - Role (Year)\n• Community service description" },
        { title: "Interests & Hobbies", type: 'text' as const, placeholder: "Photography, hiking, playing guitar, reading science fiction novels" },
        { title: "References", type: 'list' as const, placeholder: "• Name, Title, Company, Email\n• Available upon request" },
        { title: "Additional Information", type: 'text' as const, placeholder: "Any other relevant information about your background" },
        { title: "Patents", type: 'list' as const, placeholder: "• Patent Title, Patent Number (Year)\n• Brief description of invention" },
        { title: "Professional Memberships", type: 'list' as const, placeholder: "• Organization Name - Membership Level\n• Professional society membership" },
    ];

    const formatPlaceholder = (selectedType: 'text' | 'list' | 'table') => {
        switch (selectedType) {
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

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) return;

        onAdd({
            title: title.trim(),
            content: content.trim(),
            type,
        });

        // Reset form
        setTitle("");
        setContent("");
        setType('text');
        setOpen(false);
    };

    const handlePredefinedSelect = (section: typeof predefinedSections[0]) => {
        setTitle(section.title);
        setType(section.type);
        setContent(section.placeholder);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-9" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Section
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Section</DialogTitle>
                    <DialogDescription>
                        Create a custom section to highlight unique aspects of your background.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Predefined Templates */}
                    <div>
                        <Label className="text-sm font-medium">Quick Templates</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {predefinedSections.map((section) => (
                                <Button
                                    key={section.title}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePredefinedSelect(section)}
                                    className="text-xs h-8"
                                >
                                    {section.title}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="section-title" className="text-sm font-medium">
                                    Section Title *
                                </Label>
                                <Input
                                    id="section-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Publications, Volunteer Work, Interests"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="section-type" className="text-sm font-medium">
                                    Content Type
                                </Label>
                                <Select value={type} onValueChange={(value: 'text' | 'list' | 'table') => setType(value)}>
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
                                <Label htmlFor="section-content" className="text-sm font-medium">
                                    Content *
                                </Label>
                                <Textarea
                                    id="section-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={formatPlaceholder(type)}
                                    rows={4}
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {type === 'list' && "Use • for bullet points"}
                                    {type === 'table' && "Use | to separate columns and new lines for rows"}
                                    {type === 'text' && "Write paragraph content"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !content.trim()}
                    >
                        Add Section
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
