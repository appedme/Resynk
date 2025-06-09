"use client";

import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
    id: string;
    name: string;
    description: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    technologies: string[];
}

interface ProjectsEditorProps {
    projects: Project[];
    onChange: (projects: Project[]) => void;
}

export function ProjectsEditor({ projects, onChange }: ProjectsEditorProps) {
    const addProject = () => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            url: "",
            startDate: "",
            endDate: "",
            technologies: [],
        };

        onChange([...projects, newProject]);
    };

    const updateProject = (id: string, field: string, value: string | string[]) => {
        const updatedProjects = projects.map((project) =>
            project.id === id ? { ...project, [field]: value } : project
        );

        onChange(updatedProjects);
    };

    const removeProject = (id: string) => {
        const filteredProjects = projects.filter((project) => project.id !== id);
        onChange(filteredProjects);
    };

    const addTechnology = (projectId: string, tech: string) => {
        if (!tech.trim()) return;

        const project = projects.find(p => p.id === projectId);
        if (project && !project.technologies.includes(tech.trim())) {
            updateProject(projectId, 'technologies', [...project.technologies, tech.trim()]);
        }
    };

    const removeTechnology = (projectId: string, techToRemove: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            updateProject(projectId, 'technologies', project.technologies.filter(tech => tech !== techToRemove));
        }
    };

    const handleTechKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            addTechnology(projectId, input.value);
            input.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Projects</h3>
                <Button onClick={addProject} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No projects added yet.</p>
                    <Button onClick={addProject} className="mt-2" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Your First Project
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <Card key={project.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        Project #{index + 1}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeProject(project.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor={`name-${project.id}`} className="text-sm font-medium">
                                        Project Name *
                                    </Label>
                                    <Input
                                        id={`name-${project.id}`}
                                        value={project.name}
                                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                        placeholder="E-commerce Platform"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`url-${project.id}`} className="text-sm font-medium">
                                        Project URL
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`url-${project.id}`}
                                            value={project.url || ""}
                                            onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                                            placeholder="https://github.com/username/project"
                                            className="mt-1 pr-10"
                                        />
                                        {project.url && (
                                            <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor={`startDate-${project.id}`} className="text-sm font-medium">
                                            Start Date
                                        </Label>
                                        <Input
                                            id={`startDate-${project.id}`}
                                            type="month"
                                            value={project.startDate || ""}
                                            onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`endDate-${project.id}`} className="text-sm font-medium">
                                            End Date
                                        </Label>
                                        <Input
                                            id={`endDate-${project.id}`}
                                            type="month"
                                            value={project.endDate || ""}
                                            onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor={`description-${project.id}`} className="text-sm font-medium">
                                        Project Description *
                                    </Label>
                                    <Textarea
                                        id={`description-${project.id}`}
                                        value={project.description}
                                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                        placeholder="• Built a full-stack e-commerce platform with React and Node.js&#10;• Implemented secure payment processing with Stripe API&#10;• Achieved 99.9% uptime with Docker containerization"
                                        rows={4}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Describe what you built, technologies used, and key achievements.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor={`tech-${project.id}`} className="text-sm font-medium">
                                        Technologies Used
                                    </Label>
                                    <Input
                                        id={`tech-${project.id}`}
                                        placeholder="Type technology and press Enter"
                                        onKeyPress={(e) => handleTechKeyPress(e, project.id)}
                                        className="mt-1"
                                    />
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.technologies.map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                                                    onClick={() => removeTechnology(project.id, tech)}
                                                >
                                                    {tech} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Press Enter to add technologies. Click badges to remove.
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
