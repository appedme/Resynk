"use client";

import type { ResumeData } from "@/types/resume";
import { ModernTemplate } from "./templates/modern-template";
import { ProfessionalTemplate } from "./templates/professional-template";
import { CreativeTemplate } from "./templates/creative-template";

interface ResumePreviewProps {
  resume: ResumeData;
  zoom: number;
  mode: 'desktop' | 'mobile';
  template?: 'modern' | 'professional' | 'creative';
}

export function ResumePreview({ resume, zoom, mode, template = 'modern' }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
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
        fontSize: `${zoom}%`,
        fontFamily: 'Arial, sans-serif',
        color: '#333',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
