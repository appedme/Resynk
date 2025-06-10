"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Languages,
  FileText,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonalInfoEditor } from "./sections/personal-info-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { EducationEditor } from "./sections/education-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { LanguagesEditor } from "./sections/languages-editor";
import { AwardsEditor } from "./sections/awards-editor";
import { DraggableSectionList } from "./draggable-section-list";
import { AddCustomSectionDialog } from "./add-custom-section-dialog";

// Editor-specific Resume interface - matching the main editor
interface Resume {
  id: string;
  title: string;
  template: 'modern' | 'professional' | 'creative';
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    location: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    location: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    technologies: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: 'basic' | 'conversational' | 'professional' | 'native';
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date?: string;
    description?: string;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'list' | 'table';
    order: number;
  }>;
  settings: {
    fontSize: number;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    spacing: 'compact' | 'normal' | 'relaxed';
    pageMargins: 'narrow' | 'normal' | 'wide';
  };
  metadata: {
    atsScore: number;
    lastModified: Date;
    version: number;
    isPublic: boolean;
    tags: string[];
  };
}

interface ResumeEditorSidebarProps {
  resume: Resume;
  onResumeChange: (resume: Resume) => void;
}

interface SectionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  isRequired?: boolean;
}

export function ResumeEditorSidebar({ resume, onResumeChange }: ResumeEditorSidebarProps) {
  const [activeSection, setActiveSection] = useState("personal");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal", "experience", "education", "skills"])
  );
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "personal", "experience", "education", "skills", "projects",
    "certifications", "languages", "awards", ...resume.customSections.map(s => s.id)
  ]);

  // Helper function to update specific sections
  const handlePersonalInfoChange = (field: string, value: string) => {
    onResumeChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  const handleExperienceChange = (experiences: Resume['experience']) => {
    onResumeChange({
      ...resume,
      experience: experiences
    });
  };

  const handleEducationChange = (education: Resume['education']) => {
    onResumeChange({
      ...resume,
      education: education
    });
  };

  const handleSkillsChange = (skills: Resume['skills']) => {
    onResumeChange({
      ...resume,
      skills: skills
    });
  };

  const handleProjectsChange = (projects: Resume['projects']) => {
    onResumeChange({
      ...resume,
      projects: projects
    });
  };

  const handleCertificationsChange = (certifications: Resume['certifications']) => {
    onResumeChange({
      ...resume,
      certifications: certifications
    });
  };

  const handleLanguagesChange = (languages: Resume['languages']) => {
    onResumeChange({
      ...resume,
      languages: languages
    });
  };

  const handleAwardsChange = (awards: Resume['awards']) => {
    onResumeChange({
      ...resume,
      awards: awards
    });
  };

  const handleCustomSectionChange = (customSections: Resume['customSections']) => {
    onResumeChange({
      ...resume,
      customSections: customSections
    });
  };

  const addCustomSection = (sectionData: { title: string; content: string; type: 'text' | 'list' | 'table' }) => {
    const newSection = {
      id: crypto.randomUUID(),
      title: sectionData.title,
      content: sectionData.content,
      type: sectionData.type,
      order: resume.customSections.length,
    };

    handleCustomSectionChange([...resume.customSections, newSection]);
    setSectionOrder(prev => [...prev, newSection.id]);
  };

  const baseSections: SectionItem[] = [
    {
      id: "personal",
      title: "Personal Information",
      icon: <User className="w-4 h-4" />,
      component: <PersonalInfoEditor
        personalInfo={resume.personalInfo}
        onChange={handlePersonalInfoChange}
      />,
      isRequired: true,
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: <Briefcase className="w-4 h-4" />,
      component: <ExperienceEditor
        experiences={resume.experience}
        onChange={handleExperienceChange}
      />,
      isRequired: true,
    },
    {
      id: "education",
      title: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
      component: <EducationEditor
        education={resume.education}
        onChange={handleEducationChange}
      />,
      isRequired: true,
    },
    {
      id: "skills",
      title: "Skills",
      icon: <Code className="w-4 h-4" />,
      component: <SkillsEditor
        skills={resume.skills}
        onChange={handleSkillsChange}
      />,
    },
    {
      id: "projects",
      title: "Projects",
      icon: <FolderOpen className="w-4 h-4" />,
      component: <ProjectsEditor
        projects={resume.projects}
        onChange={handleProjectsChange}
      />,
    },
    {
      id: "certifications",
      title: "Certifications",
      icon: <Award className="w-4 h-4" />,
      component: <CertificationsEditor
        certifications={resume.certifications}
        onChange={handleCertificationsChange}
      />,
    },
    {
      id: "languages",
      title: "Languages",
      icon: <Languages className="w-4 h-4" />,
      component: <LanguagesEditor
        languages={resume.languages}
        onChange={handleLanguagesChange}
      />,
    },
    {
      id: "awards",
      title: "Awards & Achievements",
      icon: <Award className="w-4 h-4" />,
      component: <AwardsEditor
        awards={resume.awards}
        onChange={handleAwardsChange}
      />,
    },
  ];

  // Add custom sections dynamically
  const customSectionItems: SectionItem[] = resume.customSections.map((customSection) => ({
    id: customSection.id,
    title: customSection.title,
    icon: <FileText className="w-4 h-4" />,
    component: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{customSection.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const filteredSections = resume.customSections.filter(s => s.id !== customSection.id);
              handleCustomSectionChange(filteredSections);
              setSectionOrder(prev => prev.filter(id => id !== customSection.id));
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`title-${customSection.id}`} className="text-sm font-medium">
              Section Title
            </Label>
            <Input
              id={`title-${customSection.id}`}
              value={customSection.title}
              onChange={(e) => {
                const updatedSections = resume.customSections.map(s =>
                  s.id === customSection.id ? { ...s, title: e.target.value } : s
                );
                handleCustomSectionChange(updatedSections);
              }}
              placeholder="Section Title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`type-${customSection.id}`} className="text-sm font-medium">
              Content Type
            </Label>
            <Select
              value={customSection.type}
              onValueChange={(value: 'text' | 'list' | 'table') => {
                const updatedSections = resume.customSections.map(s =>
                  s.id === customSection.id ? { ...s, type: value } : s
                );
                handleCustomSectionChange(updatedSections);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`content-${customSection.id}`} className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id={`content-${customSection.id}`}
              value={customSection.content}
              onChange={(e) => {
                const updatedSections = resume.customSections.map(s =>
                  s.id === customSection.id ? { ...s, content: e.target.value } : s
                );
                handleCustomSectionChange(updatedSections);
              }}
              placeholder={customSection.type === 'list'
                ? "• Item 1\n• Item 2\n• Item 3"
                : customSection.type === 'table'
                  ? "Header 1 | Header 2\nRow 1 Col 1 | Row 1 Col 2"
                  : "Enter your content here..."
              }
              rows={6}
              className="mt-1"
            />
          </div>

          {/* Preview */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="text-sm mt-2">
              {customSection.type === 'list' ? (
                <ul className="list-disc list-inside space-y-1">
                  {customSection.content.split('\n').filter(line => line.trim()).map((line, index) => (
                    <li key={index}>{line.replace(/^[•\-\*]\s*/, '')}</li>
                  ))}
                </ul>
              ) : customSection.type === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    {customSection.content.split('\n').filter(line => line.trim()).map((line, index) => {
                      const cells = line.split('|').map(cell => cell.trim());
                      return (
                        <tr key={index} className={index === 0 ? 'bg-gray-100' : ''}>
                          {cells.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 px-2 py-1">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </table>
                </div>
              ) : (
                <p>{customSection.content || 'No content yet...'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
  }));

  // Combine all sections
  const allSections = [...baseSections, ...customSectionItems];

  // Order sections according to sectionOrder state
  const sections = sectionOrder
    .map(id => allSections.find(s => s.id === id))
    .filter(Boolean) as SectionItem[];

  const handleSectionsReorder = (reorderedSections: SectionItem[]) => {
    setSectionOrder(reorderedSections.map(s => s.id));
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const activeComponent = sections.find(s => s.id === activeSection)?.component;

  return (
    <div className="h-full flex flex-col">
      {/* Section Navigation */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Resume Sections
        </h2>
        <ScrollArea className="h-64">
          <DraggableSectionList
            sections={sections}
            activeSection={activeSection}
            expandedSections={expandedSections}
            onSectionSelect={setActiveSection}
            onSectionToggle={toggleSection}
            onSectionsReorder={handleSectionsReorder}
          />
        </ScrollArea>

        <AddCustomSectionDialog
          onAdd={addCustomSection}
          existingSectionCount={resume.customSections.length}
        />
      </div>

      {/* Active Section Editor */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {activeComponent}
        </ScrollArea>
      </div>
    </div>
  );
}
