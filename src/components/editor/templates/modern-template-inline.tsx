"use client";

import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import type { ResumeData, PersonalInfo } from "@/types/resume";

interface ModernTemplateInlineProps {
    resume: ResumeData;
    mode: 'desktop' | 'mobile';
    settings?: {
        fontSize?: number;
        fontFamily?: string;
        primaryColor?: string;
        secondaryColor?: string;
        spacing?: 'compact' | 'normal' | 'relaxed';
        pageMargins?: 'narrow' | 'normal' | 'wide';
    };
    onFieldClick?: (section: string, field: string, index?: number, subField?: string) => void;
    editingField?: {
        section: string;
        field: string;
        index?: number;
        subField?: string;
    } | null;
    editingValue?: string;
    onEditingValueChange?: (value: string) => void;
    onFieldUpdate?: () => void;
    onEditingCancel?: () => void;
}

export function ModernTemplateInline({
    resume,
    settings,
    onFieldClick,
    editingField,
    editingValue,
    onEditingValueChange,
    onFieldUpdate,
    onEditingCancel
}: ModernTemplateInlineProps) {
    // Add null checks and fallbacks
    if (!resume) {
        return <div className="p-8">Loading...</div>;
    }

    const {
        personal = {} as PersonalInfo,
        experience = [],
        education = [],
        skills = [],
        projects = [],
        achievements = [],
        certifications = [],
        languages = [],
        custom_sections = []
    } = resume;

    // Apply settings with defaults
    const primaryColor = settings?.primaryColor || '#2563eb'; // blue-600
    const secondaryColor = settings?.secondaryColor || '#374151'; // gray-700
    const spacingClass = settings?.spacing === 'compact' ? 'space-y-4' : settings?.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
    const marginsClass = settings?.pageMargins === 'narrow' ? 'p-4' : settings?.pageMargins === 'wide' ? 'p-12' : 'p-6';

    const isFieldEditing = (section: string, field: string, index?: number, subField?: string) => {
        if (!editingField) return false;
        return editingField.section === section &&
            editingField.field === field &&
            editingField.index === index &&
            editingField.subField === subField;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onFieldUpdate?.();
        } else if (e.key === 'Escape') {
            onEditingCancel?.();
        } else if (e.key === 'Tab') {
            // Allow tab to work normally for accessibility
            e.stopPropagation();
        }
    };

    const renderEditableText = (
        content: string,
        section: string,
        field: string,
        index?: number,
        subField?: string,
        className?: string,
        placeholder?: string
    ) => {
        const isEditing = isFieldEditing(section, field, index, subField);

        if (isEditing) {
            return (
                <input
                    type="text"
                    value={editingValue || ''}
                    onChange={(e) => onEditingValueChange?.(e.target.value)}
                    onBlur={onFieldUpdate}
                    onKeyDown={handleKeyDown}
                    className={`bg-blue-50 border-2 border-blue-300 rounded px-2 py-1 outline-none ${className || ''}`}
                    placeholder={placeholder}
                    autoFocus
                />
            );
        }

        return (
            <span
                className={`${onFieldClick ? 'cursor-pointer hover:bg-blue-50 hover:outline-2 hover:outline-blue-200 rounded px-1 transition-all duration-200' : ''} ${className || ''}`}
                onClick={() => onFieldClick?.(section, field, index, subField)}
                title={onFieldClick ? 'Click to edit (or press Enter)' : undefined}
                role={onFieldClick ? 'button' : undefined}
                tabIndex={onFieldClick ? 0 : undefined}
                onKeyDown={(e) => {
                    if (onFieldClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onFieldClick(section, field, index, subField);
                    }
                }}
            >
                {content || placeholder || 'Click to add...'}
            </span>
        );
    };

    const renderEditableTextarea = (
        content: string,
        section: string,
        field: string,
        index?: number,
        subField?: string,
        className?: string,
        placeholder?: string
    ) => {
        const isEditing = isFieldEditing(section, field, index, subField);

        if (isEditing) {
            return (
                <textarea
                    value={editingValue || ''}
                    onChange={(e) => onEditingValueChange?.(e.target.value)}
                    onBlur={onFieldUpdate}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            onEditingCancel?.();
                        }
                    }}
                    className={`bg-blue-50 border-2 border-blue-300 rounded px-2 py-1 outline-none resize-none ${className || ''}`}
                    placeholder={placeholder}
                    autoFocus
                    rows={3}
                />
            );
        }

        return (
            <div
                className={`${onFieldClick ? 'cursor-pointer hover:bg-blue-50 hover:outline-2 hover:outline-blue-200 rounded px-1 transition-all duration-200' : ''} ${className || ''}`}
                onClick={() => onFieldClick?.(section, field, index, subField)}
                title={onFieldClick ? 'Click to edit (or press Enter)' : undefined}
                role={onFieldClick ? 'button' : undefined}
                tabIndex={onFieldClick ? 0 : undefined}
                onKeyDown={(e) => {
                    if (onFieldClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onFieldClick(section, field, index, subField);
                    }
                }}
            >
                {content || placeholder || 'Click to add...'}
            </div>
        );
    };

    return (
        <div className={`max-w-none mx-auto bg-white shadow-lg ${marginsClass} ${spacingClass}`} data-testid="resume-template" style={{ fontFamily: settings?.fontFamily }}>
            {/* Header Section */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                    {renderEditableText(personal.full_name || '', 'personalInfo', 'firstName', undefined, undefined, '', 'Your Name')}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm mb-4" style={{ color: secondaryColor }}>
                    {personal.email && (
                        <div className="flex items-center gap-1">
                            <Mail size={12} />
                            {renderEditableText(personal.email, 'personalInfo', 'email')}
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-1">
                            <Phone size={12} />
                            {renderEditableText(personal.phone, 'personalInfo', 'phone')}
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            {renderEditableText(personal.location, 'personalInfo', 'location')}
                        </div>
                    )}
                    {personal.website && (
                        <div className="flex items-center gap-1">
                            <Globe size={12} />
                            {renderEditableText(personal.website, 'personalInfo', 'website')}
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin size={12} />
                            {renderEditableText(personal.linkedin, 'personalInfo', 'linkedin')}
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                {resume.summary && (
                    <div className="text-center mb-6">
                        <div className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            {renderEditableTextarea(resume.summary, 'personalInfo', 'summary', undefined, undefined, 'w-full')}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience Section */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {renderEditableText(exp.position, 'experience', 'position', index)}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {renderEditableText(exp.start_date, 'experience', 'start_date', index)} - {renderEditableText(exp.end_date || (exp.is_current ? 'Present' : ''), 'experience', 'end_date', index)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    {renderEditableText(exp.company, 'experience', 'company', index)}
                                    {exp.location && (
                                        <span> • {renderEditableText(exp.location, 'experience', 'location', index)}</span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700">
                                    {renderEditableTextarea(exp.description, 'experience', 'description', index)}
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                                        {exp.achievements.map((achievement, achieveIndex) => (
                                            <li key={achieveIndex}>{achievement}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education Section */}
            {education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {renderEditableText(edu.degree, 'education', 'degree', index)}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {renderEditableText(edu.start_date, 'education', 'start_date', index)} - {renderEditableText(edu.end_date || 'Present', 'education', 'end_date', index)}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {renderEditableText(edu.institution, 'education', 'institution', index)}
                                    {edu.location && (
                                        <span> • {renderEditableText(edu.location, 'education', 'location', index)}</span>
                                    )}
                                </div>
                                {edu.gpa && (
                                    <div className="text-sm text-gray-600">
                                        GPA: {renderEditableText(edu.gpa, 'education', 'gpa', index)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={skill.id}
                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                                {renderEditableText(skill.name, 'skills', 'name', index)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <div key={project.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {renderEditableText(project.name, 'projects', 'name', index)}
                                    </h3>
                                    {project.url && (
                                        <a href={project.url} className="text-sm text-blue-600 hover:underline">
                                            {renderEditableText(project.url, 'projects', 'url', index)}
                                        </a>
                                    )}
                                </div>
                                <div className="text-sm text-gray-700 mb-2">
                                    {renderEditableTextarea(project.description, 'projects', 'description', index)}
                                </div>
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-2 py-1 bg-blue-50 text-blue-800 rounded text-xs"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Sections */}
            {custom_sections.map((section) => (
                <div key={section.id} className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                        {section.title}
                    </h2>
                    <div className="text-sm text-gray-700">
                        {section.type === 'list' ? (
                            <ul className="list-disc list-inside space-y-1">
                                {section.content.split('\n').filter(line => line.trim()).map((line, index) => (
                                    <li key={index}>{line.replace(/^[•\-\*]\s*/, '')}</li>
                                ))}
                            </ul>
                        ) : section.type === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    {section.content.split('\n').filter(line => line.trim()).map((line, index) => {
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
                            <p>{section.content}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
