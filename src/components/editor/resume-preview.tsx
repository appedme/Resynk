"use client";

// Editor-specific Resume interface
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

import { ModernTemplate } from "./templates/modern-template";
import { ProfessionalTemplate } from "./templates/professional-template";
import { CreativeTemplate } from "./templates/creative-template";

interface ResumePreviewProps {
  resume: Resume;
  zoom: number;
  mode: 'desktop' | 'mobile';
}

export function ResumePreview({ resume, zoom, mode }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (resume.template) {
      case 'professional':
        return <ProfessionalTemplate resume={resume} mode={mode} />;
      case 'creative':
        return <CreativeTemplate resume={resume} mode={mode} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} mode={mode} />;
    }
  };

  return (
    <div 
      className="w-full h-full bg-white"
      data-resume-preview
      style={{
        fontSize: `${(resume.settings.fontSize * zoom) / 100}px`,
        fontFamily: resume.settings.fontFamily,
        color: resume.settings.secondaryColor,
      }}
    >
      {renderTemplate()}
    </div>
  );
}
