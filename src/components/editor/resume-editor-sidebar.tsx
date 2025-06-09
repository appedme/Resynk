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
  Plus,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonalInfoEditor } from "./sections/personal-info-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { EducationEditor } from "./sections/education-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { LanguagesEditor } from "./sections/languages-editor";
import { AwardsEditor } from "./sections/awards-editor";

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

  const sections: SectionItem[] = [
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
          <div className="space-y-1">
            {sections.map((section) => (
              <div key={section.id}>
                <Button
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-between h-10"
                  onClick={() => {
                    setActiveSection(section.id);
                    if (!expandedSections.has(section.id)) {
                      toggleSection(section.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                    {section.isRequired && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.id);
                    }}
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button variant="outline" className="w-full mt-3 h-9" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Section
        </Button>
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
