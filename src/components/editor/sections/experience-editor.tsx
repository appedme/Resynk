"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
  description: string;
  technologies: string[];
}

interface ExperienceEditorProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

export function ExperienceEditor({ experiences, onChange }: ExperienceEditorProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
      technologies: [],
    };

    onChange([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    const updatedExperiences = experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );

    onChange(updatedExperiences);
  };

  const removeExperience = (id: string) => {
    const filteredExperiences = experiences.filter((exp) => exp.id !== id);
    onChange(filteredExperiences);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <Button onClick={addExperience} className="mt-2" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Your First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <Card key={exp.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Experience #{index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`position-${exp.id}`} className="text-sm font-medium">
                    Job Title *
                  </Label>
                  <Input
                    id={`position-${exp.id}`}
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`company-${exp.id}`} className="text-sm font-medium">
                    Company *
                  </Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`location-${exp.id}`} className="text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id={`location-${exp.id}`}
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`startDate-${exp.id}`} className="text-sm font-medium">
                      Start Date *
                    </Label>
                    <Input
                      id={`startDate-${exp.id}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`endDate-${exp.id}`} className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input
                      id={`endDate-${exp.id}`}
                      type="month"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => {
                      updateExperience(exp.id, 'current', checked);
                      if (checked) {
                        updateExperience(exp.id, 'endDate', '');
                      }
                    }}
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm">
                    I currently work here
                  </Label>
                </div>

                <div>
                  <Label htmlFor={`description-${exp.id}`} className="text-sm font-medium">
                    Job Description
                  </Label>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Implemented automated testing and CI/CD pipelines"
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use bullet points to describe your key responsibilities and achievements.
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
