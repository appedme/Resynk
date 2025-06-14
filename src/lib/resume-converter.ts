// Utility functions to convert between Editor Resume format and ResumeData format
"use client";

import type { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Project, Achievement, Certification, Language, CustomSection } from '@/types/resume';

// Editor Resume interface (from editor page)
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

// Convert Editor Resume to ResumeData format
export function convertEditorResumeToResumeData(editorResume: EditorResume): ResumeData {
    const personal: PersonalInfo = {
        full_name: `${editorResume.personalInfo.firstName} ${editorResume.personalInfo.lastName}`.trim(),
        email: editorResume.personalInfo.email,
        phone: editorResume.personalInfo.phone,
        location: editorResume.personalInfo.location,
        linkedin: editorResume.personalInfo.linkedin,
        website: editorResume.personalInfo.website,
        portfolio: editorResume.personalInfo.website,
    };

    const experience: WorkExperience[] = editorResume.experience.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        location: exp.location,
        start_date: exp.startDate,
        end_date: exp.endDate,
        is_current: exp.current,
        description: exp.description,
        achievements: exp.technologies, // Map technologies to achievements for now
    }));

    const education: Education[] = editorResume.education.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        location: edu.location,
        start_date: edu.startDate,
        end_date: edu.endDate,
        gpa: edu.gpa,
    }));

    const skills: Skill[] = editorResume.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: 'technical', // Default category
        proficiency: skill.level,
    }));

    const projects: Project[] = editorResume.projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        start_date: project.startDate,
        end_date: project.endDate,
        url: project.url,
        highlights: [], // Empty for now
    }));

    const achievements: Achievement[] = editorResume.awards.map(award => ({
        id: award.id,
        title: award.title,
        description: award.description || '',
        date: award.date,
        issuer: award.issuer,
    }));

    const certifications: Certification[] = editorResume.certifications.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issueDate || '',
        expiry_date: cert.expiryDate,
    }));

    const languages: Language[] = editorResume.languages.map(lang => ({
        id: lang.id,
        name: lang.language,
        proficiency: lang.proficiency,
    }));

    const custom_sections: CustomSection[] = editorResume.customSections.map(section => ({
        id: section.id,
        title: section.title,
        content: section.content,
        type: section.type,
        order: section.order,
    }));

    return {
        personal,
        summary: editorResume.personalInfo.summary,
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

// Convert ResumeData to Editor Resume format
export function convertResumeDataToEditorResume(resumeData: ResumeData, id?: string): EditorResume {
    const nameParts = resumeData.personal.full_name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
        id: id || crypto.randomUUID(),
        title: `${resumeData.personal.full_name}'s Resume`,
        template: 'modern', // Default template
        personalInfo: {
            firstName,
            lastName,
            email: resumeData.personal.email,
            phone: resumeData.personal.phone || '',
            location: resumeData.personal.location || '',
            website: resumeData.personal.website || resumeData.personal.portfolio || '',
            linkedin: resumeData.personal.linkedin || '',
            summary: resumeData.summary,
        },
        experience: resumeData.experience.map(exp => ({
            id: exp.id,
            position: exp.position,
            company: exp.company,
            startDate: exp.start_date,
            endDate: exp.end_date,
            current: exp.is_current,
            location: exp.location || '',
            description: exp.description,
            technologies: exp.achievements, // Map achievements back to technologies
        })),
        education: resumeData.education.map(edu => ({
            id: edu.id,
            degree: edu.degree,
            institution: edu.institution,
            startDate: edu.start_date,
            endDate: edu.end_date,
            location: edu.location || '',
            gpa: edu.gpa,
        })),
        skills: resumeData.skills.map(skill => ({
            id: skill.id,
            name: skill.name,
            level: skill.proficiency,
        })),
        projects: resumeData.projects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            url: project.url,
            startDate: project.start_date,
            endDate: project.end_date,
            technologies: project.technologies,
        })),
        certifications: resumeData.certifications.map(cert => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            issueDate: cert.issue_date,
            expiryDate: cert.expiry_date,
        })),
        languages: resumeData.languages.map(lang => ({
            id: lang.id,
            language: lang.name,
            proficiency: lang.proficiency,
        })),
        awards: resumeData.achievements.map(achievement => ({
            id: achievement.id,
            title: achievement.title,
            issuer: achievement.issuer || '',
            date: achievement.date,
            description: achievement.description,
        })),
        customSections: resumeData.custom_sections.map(section => ({
            id: section.id,
            title: section.title,
            content: section.content,
            type: section.type,
            order: section.order,
        })),
        settings: {
            fontSize: 12,
            fontFamily: 'Inter',
            primaryColor: '#3B82F6',
            secondaryColor: '#64748B',
            spacing: 'normal',
            pageMargins: 'normal',
        },
        metadata: {
            atsScore: 0,
            lastModified: new Date(),
            version: 1,
            isPublic: false,
            tags: [],
        },
    };
}
