"use client";

import type { ResumeData, PersonalInfo } from "@/types/resume";

interface ProfessionalTemplateInlineProps {
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

export function ProfessionalTemplateInline({
    resume,
    onFieldClick,
    editingField,
    editingValue,
    onEditingValueChange,
    onFieldUpdate,
    onEditingCancel
}: ProfessionalTemplateInlineProps) {
    if (!resume) {
        return <div className="p-8">Loading...</div>;
    }

    const {
        personal = {} as PersonalInfo,
        experience = []
    } = resume;

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
                className={`${onFieldClick ? 'cursor-pointer hover:bg-blue-50 hover:outline-2 hover:outline-blue-200 rounded px-1' : ''} ${className || ''}`}
                onClick={() => onFieldClick?.(section, field, index, subField)}
                title={onFieldClick ? 'Click to edit' : undefined}
            >
                {content || placeholder || 'Click to add...'}
            </span>
        );
    };

    return (
        <div className="max-w-none mx-auto bg-white p-8 space-y-6" data-testid="resume-template">
            <div className="border-b-2 border-gray-300 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {renderEditableText(personal.full_name || '', 'personalInfo', 'firstName', undefined, undefined, '', 'Your Name')}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    {personal.email && (
                        <div>Email: {renderEditableText(personal.email, 'personalInfo', 'email')}</div>
                    )}
                    {personal.phone && (
                        <div>Phone: {renderEditableText(personal.phone, 'personalInfo', 'phone')}</div>
                    )}
                </div>
            </div>

            {/* Experience Section */}
            {experience.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <div key={exp.id}>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {renderEditableText(exp.position, 'experience', 'position', index)}
                                </h3>
                                <h4 className="text-md font-medium text-gray-700">
                                    {renderEditableText(exp.company, 'experience', 'company', index)}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}