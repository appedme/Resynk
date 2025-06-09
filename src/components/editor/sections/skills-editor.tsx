"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Skill {
    id: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface SkillsEditorProps {
    skills: Skill[];
    onChange: (skills: Skill[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
    const addSkill = (name: string) => {
        if (!name.trim()) return;

        const newSkill: Skill = {
            id: crypto.randomUUID(),
            name: name.trim(),
            level: 'intermediate',
        };

        onChange([...skills, newSkill]);
    };

    const updateSkill = (id: string, field: string, value: string) => {
        const updatedSkills = skills.map((skill) =>
            skill.id === id ? { ...skill, [field]: value } : skill
        );

        onChange(updatedSkills);
    };

    const removeSkill = (id: string) => {
        const filteredSkills = skills.filter((skill) => skill.id !== id);
        onChange(filteredSkills);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            addSkill(input.value);
            input.value = '';
        }
    };

    const predefinedSkills = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
        'HTML/CSS', 'Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'GraphQL',
        'REST APIs', 'Agile', 'Leadership', 'Communication', 'Problem Solving'
    ];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
            </div>

            {/* Add Skill Input */}
            <div>
                <Label htmlFor="skillInput" className="text-sm font-medium">
                    Add Skill
                </Label>
                <Input
                    id="skillInput"
                    placeholder="Type a skill and press Enter"
                    onKeyPress={handleKeyPress}
                    className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Press Enter to add a skill
                </p>
            </div>

            {/* Predefined Skills */}
            <div>
                <Label className="text-sm font-medium">Quick Add</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedSkills
                        .filter(skill => !skills.some(s => s.name.toLowerCase() === skill.toLowerCase()))
                        .slice(0, 8)
                        .map((skill) => (
                            <Button
                                key={skill}
                                variant="outline"
                                size="sm"
                                onClick={() => addSkill(skill)}
                                className="h-7 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {skill}
                            </Button>
                        ))}
                </div>
            </div>

            {/* Current Skills */}
            {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No skills added yet.</p>
                    <p className="text-xs mt-1">Add your technical and soft skills above</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Your Skills</Label>
                    <div className="space-y-2">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                    <Badge variant="secondary" className="font-medium">
                                        {skill.name}
                                    </Badge>
                                    <div className="flex-1">
                                        <Select
                                            value={skill.level}
                                            onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                                        >
                                            <SelectTrigger className="w-32 h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                                <SelectItem value="expert">Expert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSkill(skill.id)}
                                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
