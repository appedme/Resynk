"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Award {
    id: string;
    title: string;
    issuer: string;
    date?: string;
    description?: string;
}

interface AwardsEditorProps {
    awards: Award[];
    onChange: (awards: Award[]) => void;
}

export function AwardsEditor({ awards, onChange }: AwardsEditorProps) {
    const addAward = () => {
        const newAward: Award = {
            id: crypto.randomUUID(),
            title: "",
            issuer: "",
            date: "",
            description: "",
        };

        onChange([...awards, newAward]);
    };

    const updateAward = (id: string, field: string, value: string) => {
        const updatedAwards = awards.map((award) =>
            award.id === id ? { ...award, [field]: value } : award
        );

        onChange(updatedAwards);
    };

    const removeAward = (id: string) => {
        const filteredAwards = awards.filter((award) => award.id !== id);
        onChange(filteredAwards);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Awards & Achievements</h3>
                <Button onClick={addAward} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Award
                </Button>
            </div>

            {awards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No awards added yet.</p>
                    <Button onClick={addAward} className="mt-2" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Your First Award
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {awards.map((award, index) => (
                        <Card key={award.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        Award #{index + 1}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAward(award.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor={`title-${award.id}`} className="text-sm font-medium">
                                        Award Title *
                                    </Label>
                                    <Input
                                        id={`title-${award.id}`}
                                        value={award.title}
                                        onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                                        placeholder="Employee of the Year"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`issuer-${award.id}`} className="text-sm font-medium">
                                        Issuing Organization *
                                    </Label>
                                    <Input
                                        id={`issuer-${award.id}`}
                                        value={award.issuer}
                                        onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                                        placeholder="Tech Company Inc."
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`date-${award.id}`} className="text-sm font-medium">
                                        Date Received
                                    </Label>
                                    <Input
                                        id={`date-${award.id}`}
                                        type="month"
                                        value={award.date || ""}
                                        onChange={(e) => updateAward(award.id, 'date', e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`description-${award.id}`} className="text-sm font-medium">
                                        Description (Optional)
                                    </Label>
                                    <Textarea
                                        id={`description-${award.id}`}
                                        value={award.description || ""}
                                        onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                                        placeholder="Brief description of the achievement and its significance..."
                                        rows={3}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Describe what you achieved and why it was significant.
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
