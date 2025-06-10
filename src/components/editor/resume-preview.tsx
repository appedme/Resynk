"use client";

import { useState, useCallback } from "react";
import type { ResumeData } from "@/types/resume";
import { ModernTemplate } from "./templates/modern-template";
import { ModernTemplateInline } from "./templates/modern-template-inline";
import { ProfessionalTemplate } from "./templates/professional-template";
import { ProfessionalTemplateInline } from "./templates/professional-template-inline";
import { CreativeTemplate } from "./templates/creative-template";
import { convertEditorResumeToResumeData, type EditorResume } from "@/lib/data-converter";
import { toast } from "sonner";

interface ResumePreviewProps {
  resume: EditorResume | null;
  zoom: number;
  mode: 'desktop' | 'mobile';
  template?: 'modern' | 'professional' | 'creative';
  onResumeUpdate?: (resume: EditorResume) => void;
  isInlineEditingEnabled?: boolean;
}

export function ResumePreview({
  resume,
  zoom,
  mode,
  template = 'modern',
  onResumeUpdate,
  isInlineEditingEnabled = true
}: ResumePreviewProps) {
  const [editingField, setEditingField] = useState<{
    section: string;
    field: string;
    index?: number;
    subField?: string;
  } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

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

  const getCurrentFieldValue = useCallback((section: string, field: string, index?: number, subField?: string): string => {
    if (!resume) return '';

    try {
      if (section === 'personalInfo') {
        return (resume.personalInfo as Record<string, unknown>)[field] as string || '';
      } else if (section === 'experience' && index !== undefined) {
        const exp = resume.experience[index];
        if (subField) {
          return (exp as Record<string, unknown>)[subField] as string || '';
        }
        return (exp as Record<string, unknown>)[field] as string || '';
      } else if (section === 'education' && index !== undefined) {
        const edu = resume.education[index];
        if (subField) {
          return (edu as Record<string, unknown>)[subField] as string || '';
        }
        return (edu as Record<string, unknown>)[field] as string || '';
      } else if (section === 'skills' && index !== undefined) {
        return resume.skills[index]?.name || '';
      } else if (section === 'projects' && index !== undefined) {
        const project = resume.projects[index];
        if (subField) {
          return (project as Record<string, unknown>)[subField] as string || '';
        }
        return (project as Record<string, unknown>)[field] as string || '';
      }
    } catch (error) {
      console.warn('Error getting field value:', error);
    }

    return '';
  }, [resume]);

  // Handle inline editing
  const handleFieldClick = useCallback((section: string, field: string, index?: number, subField?: string) => {
    if (!isInlineEditingEnabled || !resume || !onResumeUpdate) return;

    const currentValue = getCurrentFieldValue(section, field, index, subField);
    setEditingField({ section, field, index, subField });
    setEditingValue(currentValue || '');
  }, [isInlineEditingEnabled, resume, onResumeUpdate, getCurrentFieldValue]);

  const handleFieldUpdate = useCallback(() => {
    if (!editingField || !resume || !onResumeUpdate) return;

    const updatedResume = { ...resume };
    const { section, field, index, subField } = editingField;

    try {
      if (section === 'personalInfo') {
        updatedResume.personalInfo = {
          ...updatedResume.personalInfo,
          [field]: editingValue
        };
      } else if (section === 'experience' && index !== undefined) {
        const updatedExperience = [...updatedResume.experience];
        if (subField) {
          updatedExperience[index] = {
            ...updatedExperience[index],
            [subField]: editingValue
          };
        } else {
          updatedExperience[index] = {
            ...updatedExperience[index],
            [field]: editingValue
          };
        }
        updatedResume.experience = updatedExperience;
      } else if (section === 'education' && index !== undefined) {
        const updatedEducation = [...updatedResume.education];
        if (subField) {
          updatedEducation[index] = {
            ...updatedEducation[index],
            [subField]: editingValue
          };
        } else {
          updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: editingValue
          };
        }
        updatedResume.education = updatedEducation;
      } else if (section === 'skills' && index !== undefined) {
        const updatedSkills = [...updatedResume.skills];
        updatedSkills[index] = {
          ...updatedSkills[index],
          name: editingValue
        };
        updatedResume.skills = updatedSkills;
      } else if (section === 'projects' && index !== undefined) {
        const updatedProjects = [...updatedResume.projects];
        if (subField) {
          updatedProjects[index] = {
            ...updatedProjects[index],
            [subField]: editingValue
          };
        } else {
          updatedProjects[index] = {
            ...updatedProjects[index],
            [field]: editingValue
          };
        }
        updatedResume.projects = updatedProjects;
      }

      onResumeUpdate(updatedResume);

      // Show success feedback
      toast.success("Resume updated successfully!", {
        duration: 2000,
        position: "bottom-right"
      });
    } catch (error) {
      console.error('Error updating field:', error);
    }

    setEditingField(null);
    setEditingValue('');
  }, [editingField, editingValue, resume, onResumeUpdate]);

  const renderTemplate = () => {
    const templateToUse = resume?.template || template;
    const settings = resume?.settings || {};

    // Use inline-editable templates when inline editing is enabled
    if (isInlineEditingEnabled && onResumeUpdate) {
      switch (templateToUse) {
        case 'modern':
        default:
          return (
            <ModernTemplateInline
              resume={resumeData}
              mode={mode}
              settings={settings}
              onFieldClick={handleFieldClick}
              editingField={editingField}
              editingValue={editingValue}
              onEditingValueChange={setEditingValue}
              onFieldUpdate={handleFieldUpdate}
              onEditingCancel={() => {
                setEditingField(null);
                setEditingValue('');
              }}
            />
          );
        case 'professional':
          return (
            <ProfessionalTemplateInline
              resume={resumeData}
              mode={mode}
              settings={settings}
              onFieldClick={handleFieldClick}
              editingField={editingField}
              editingValue={editingValue}
              onEditingValueChange={setEditingValue}
              onFieldUpdate={handleFieldUpdate}
              onEditingCancel={() => {
                setEditingField(null);
                setEditingValue('');
              }}
            />
          );
        case 'creative':
          return <CreativeTemplate resume={resumeData} mode={mode} settings={settings} />;
      }
    }

    // Use regular templates when inline editing is disabled
    switch (templateToUse) {
      case 'professional':
        return <ProfessionalTemplate resume={resumeData} mode={mode} settings={settings} />;
      case 'creative':
        return <CreativeTemplate resume={resumeData} mode={mode} settings={settings} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resumeData} mode={mode} settings={settings} />;
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
