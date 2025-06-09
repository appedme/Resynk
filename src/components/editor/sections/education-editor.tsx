"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location: string;
  gpa?: string;
}

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      gpa: "",
    };

    onChange([...education, newEducation]);
  };

  const updateEducation = (id: string, field: string, value: string | boolean) => {
    const updatedEducation = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    onChange(updatedEducation);
  };

  const removeEducation = (id: string) => {
    const filteredEducation = education.filter((edu) => edu.id !== id);
    onChange(filteredEducation);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet.</p>
          <Button onClick={addEducation} className="mt-2" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Your Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <Card key={edu.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Education #{index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium">
                    Degree *
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`institution-${edu.id}`} className="text-sm font-medium">
                    Institution *
                  </Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University of California, Berkeley"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`location-${edu.id}`} className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id={`location-${edu.id}`}
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="Berkeley, CA"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`startDate-${edu.id}`} className="text-sm font-medium">
                      Start Date *
                    </Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`endDate-${edu.id}`} className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input
                      id={`endDate-${edu.id}`}
                      type="month"
                      value={edu.endDate || ""}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      disabled={edu.current}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${edu.id}`}
                    checked={edu.current || false}
                    onCheckedChange={(checked) => {
                      updateEducation(edu.id, 'current', checked);
                      if (checked) {
                        updateEducation(edu.id, 'endDate', '');
                      }
                    }}
                  />
                  <Label htmlFor={`current-${edu.id}`} className="text-sm">
                    Currently studying here
                  </Label>
                </div>

                <div>
                  <Label htmlFor={`gpa-${edu.id}`} className="text-sm font-medium">
                    GPA (Optional)
                  </Label>
                  <Input
                    id={`gpa-${edu.id}`}
                    value={edu.gpa || ""}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8 / 4.0"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include only if 3.5 or higher
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
