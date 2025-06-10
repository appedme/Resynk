// Data conversion utilities for Resume Editor
import type { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Project, Certification, Language, CustomSection } from "@/types/resume";

// Editor's Resume interface (from resume-editor-sidebar.tsx)
export interface EditorResume {
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

/**
 * Converts EditorResume to ResumeData format for templates
 */
export function convertEditorResumeToResumeData(editorResume: EditorResume): ResumeData {
    if (!editorResume) {
        return createEmptyResumeData();
    }

    const personal: PersonalInfo = {
        full_name: `${editorResume.personalInfo?.firstName || ''} ${editorResume.personalInfo?.lastName || ''}`.trim() || 'Your Name',
        email: editorResume.personalInfo?.email || '',
        phone: editorResume.personalInfo?.phone || undefined,
        location: editorResume.personalInfo?.location || undefined,
        linkedin: editorResume.personalInfo?.linkedin || undefined,
        website: editorResume.personalInfo?.website || undefined,
    };

    const experience: WorkExperience[] = (editorResume.experience || []).map(exp => ({
        id: exp.id,
        company: exp.company || '',
        position: exp.position || '',
        location: exp.location || undefined,
        start_date: exp.startDate || '',
        end_date: exp.current ? undefined : exp.endDate,
        is_current: exp.current || false,
        description: exp.description || '',
        achievements: exp.technologies || [], // Map technologies to achievements for now
    }));

    const education: Education[] = (editorResume.education || []).map(edu => ({
        id: edu.id,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field_of_study: undefined,
        location: edu.location || undefined,
        start_date: edu.startDate || '',
        end_date: edu.current ? undefined : edu.endDate,
        gpa: edu.gpa || undefined,
        honors: undefined,
        relevant_coursework: undefined,
    }));

    const skills: Skill[] = (editorResume.skills || []).map(skill => ({
        id: skill.id,
        name: skill.name || '',
        category: 'technical' as const,
        proficiency: skill.level || 'intermediate',
        years_experience: undefined,
    }));

    const projects: Project[] = (editorResume.projects || []).map(project => ({
        id: project.id,
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologies || [],
        start_date: project.startDate || undefined,
        end_date: project.endDate || undefined,
        url: project.url || undefined,
        github_url: undefined,
        highlights: [],
    }));

    const certifications: Certification[] = (editorResume.certifications || []).map(cert => ({
        id: cert.id,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issue_date: cert.issueDate || '',
        expiry_date: cert.expiryDate || undefined,
        credential_id: undefined,
        url: undefined,
    }));

    const languages: Language[] = (editorResume.languages || []).map(lang => ({
        id: lang.id,
        name: lang.language || '',
        proficiency: lang.proficiency || 'conversational',
    }));

    const custom_sections: CustomSection[] = (editorResume.customSections || []).map(section => ({
        id: section.id,
        title: section.title || '',
        content: section.content || '',
        type: section.type || 'text',
        order: section.order || 0,
    }));

    // Map awards to achievements
    const achievements = (editorResume.awards || []).map(award => ({
        id: award.id,
        title: award.title || '',
        issuer: award.issuer || '',
        date: award.date || '',
        description: award.description || '',
    }));

    return {
        personal,
        summary: editorResume.personalInfo?.summary || '',
        experience,
        education,
        skills,
        projects,
        achievements,
        certifications,
        languages,
        custom_sections,
    };
}

/**
 * Creates an empty ResumeData object
 */
export function createEmptyResumeData(): ResumeData {
    return {
        personal: {
            full_name: 'Your Name',
            email: '',
        },
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
}
