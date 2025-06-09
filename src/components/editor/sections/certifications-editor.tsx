"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
}

interface CertificationsEditorProps {
    certifications: Certification[];
    onChange: (certifications: Certification[]) => void;
}

export function CertificationsEditor({ certifications, onChange }: CertificationsEditorProps) {
    const addCertification = () => {
        const newCertification: Certification = {
            id: crypto.randomUUID(),
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
        };

        onChange([...certifications, newCertification]);
    };

    const updateCertification = (id: string, field: string, value: string) => {
        const updatedCertifications = certifications.map((cert) =>
            cert.id === id ? { ...cert, [field]: value } : cert
        );

        onChange(updatedCertifications);
    };

    const removeCertification = (id: string) => {
        const filteredCertifications = certifications.filter((cert) => cert.id !== id);
        onChange(filteredCertifications);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Certifications</h3>
                <Button onClick={addCertification} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                </Button>
            </div>

            {certifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No certifications added yet.</p>
                    <Button onClick={addCertification} className="mt-2" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Your First Certification
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {certifications.map((cert, index) => (
                        <Card key={cert.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        Certification #{index + 1}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCertification(cert.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor={`name-${cert.id}`} className="text-sm font-medium">
                                        Certification Name *
                                    </Label>
                                    <Input
                                        id={`name-${cert.id}`}
                                        value={cert.name}
                                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                        placeholder="AWS Certified Solutions Architect"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`issuer-${cert.id}`} className="text-sm font-medium">
                                        Issuing Organization *
                                    </Label>
                                    <Input
                                        id={`issuer-${cert.id}`}
                                        value={cert.issuer}
                                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                        placeholder="Amazon Web Services"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor={`issueDate-${cert.id}`} className="text-sm font-medium">
                                            Issue Date
                                        </Label>
                                        <Input
                                            id={`issueDate-${cert.id}`}
                                            type="month"
                                            value={cert.issueDate || ""}
                                            onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`expiryDate-${cert.id}`} className="text-sm font-medium">
                                            Expiry Date
                                        </Label>
                                        <Input
                                            id={`expiryDate-${cert.id}`}
                                            type="month"
                                            value={cert.expiryDate || ""}
                                            onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
