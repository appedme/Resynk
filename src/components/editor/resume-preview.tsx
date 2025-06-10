"use client";

import type { ResumeData } from "@/types/resume";
import { ModernTemplate } from "./templates/modern-template";
import { ProfessionalTemplate } from "./templates/professional-template";
import { CreativeTemplate } from "./templates/creative-template";
import { convertEditorResumeToResumeData, type EditorResume } from "@/lib/data-converter";

interface ResumePreviewProps {
  resume: EditorResume | null;
  zoom: number;
  mode: 'desktop' | 'mobile';
  template?: 'modern' | 'professional' | 'creative';
}

export function ResumePreview({ resume, zoom, mode, template = 'modern' }: ResumePreviewProps) {
  // Convert editor resume to ResumeData format
  const resumeData: ResumeData = resume ? convertEditorResumeToResumeData(resume) : {
    personal: { full_name: 'Your Name', email: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    certifications: [],
    languages: [],
    custom_sections: [],
  };

  const renderTemplate = () => {
    const templateToUse = resume?.template || template;
    
    switch (templateToUse) {
      case 'professional':
        return <ProfessionalTemplate resume={resumeData} mode={mode} />;
      case 'creative':
        return <CreativeTemplate resume={resumeData} mode={mode} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resumeData} mode={mode} />;
    }
  };

  return (
    <div
      className="w-full h-full bg-white"
      data-resume-preview
      style={{
        fontSize: `${zoom}%`,
        fontFamily: resume?.settings?.fontFamily || 'Arial, sans-serif',
        color: '#333',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
