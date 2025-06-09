"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Language {
    id: string;
    language: string;
    proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

interface LanguagesEditorProps {
    languages: Language[];
    onChange: (languages: Language[]) => void;
}

export function LanguagesEditor({ languages, onChange }: LanguagesEditorProps) {
    const addLanguage = () => {
        const newLanguage: Language = {
            id: crypto.randomUUID(),
            language: "",
            proficiency: "conversational",
        };

        onChange([...languages, newLanguage]);
    };

    const updateLanguage = (id: string, field: string, value: string) => {
        const updatedLanguages = languages.map((lang) =>
            lang.id === id ? { ...lang, [field]: value } : lang
        );

        onChange(updatedLanguages);
    };

    const removeLanguage = (id: string) => {
        const filteredLanguages = languages.filter((lang) => lang.id !== id);
        onChange(filteredLanguages);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Languages</h3>
                <Button onClick={addLanguage} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Language
                </Button>
            </div>

            {languages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No languages added yet.</p>
                    <Button onClick={addLanguage} className="mt-2" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add a Language
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {languages.map((lang) => (
                        <Card key={lang.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <Label htmlFor={`language-${lang.id}`} className="text-sm font-medium">
                                            Language
                                        </Label>
                                        <Input
                                            id={`language-${lang.id}`}
                                            value={lang.language}
                                            onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                                            placeholder="English, Spanish, French..."
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="w-40">
                                        <Label className="text-sm font-medium">Proficiency</Label>
                                        <Select
                                            value={lang.proficiency}
                                            onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="conversational">Conversational</SelectItem>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="native">Native/Fluent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLanguage(lang.id)}
                                        className="text-red-600 hover:text-red-700 mt-6"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
