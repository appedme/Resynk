"use client";

import type { ResumeData } from "@/types/resume";

interface ProfessionalTemplateProps {
    resume: ResumeData;
    mode: 'desktop' | 'mobile';
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
    const { personal, experience, education, skills, projects, certifications, languages, custom_sections } = resume;

    // Default styling since settings are not part of ResumeData
    const primaryColor = '#1f2937'; // gray-800
    const secondaryColor = '#374151'; // gray-700
    const spacing = 'space-y-6';
    const margins = 'p-8';

    // Calculate margins based on settings
    const getMargins = () => {
        return margins;
    };

    return (
        <div className={getMargins()} data-testid="resume-template">
            {/* Header Section */}
            <div className="border-b-2 border-gray-300 pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {personal.full_name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Email: {personal.email}</div>
                    {personal.phone && <div>Phone: {personal.phone}</div>}
                    {personal.location && <div>Location: {personal.location}</div>}
                    {personal.website && <div>Website: {personal.website}</div>}
                    {personal.linkedin && <div>LinkedIn: {personal.linkedin}</div>}
                </div>

                {resume.summary && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {resume.summary}
                        </p>
                    </div>
                )}
            </div>

            <div className={spacing}>
                {/* Experience Section */}
                {experience.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={exp.id || index} className="border-l-4 border-gray-300 pl-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                            <p className="text-lg text-gray-700 font-medium">{exp.company}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            <p className="font-medium">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'Present'}</p>
                                            {exp.location && <p>{exp.location}</p>}
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <div className="text-gray-700 mb-2">
                                            <p>{exp.description}</p>
                                        </div>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
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
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={edu.id || index} className="border-l-4 border-gray-300 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                            <p className="text-gray-700 font-medium">{edu.institution}</p>
                                            {edu.field_of_study && <p className="text-gray-600">{edu.field_of_study}</p>}
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            <p className="font-medium">{edu.start_date} - {edu.end_date || 'Present'}</p>
                                            {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Skills
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {skills.map((skill, index) => (
                                <div key={skill.id || index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="font-medium text-gray-800">{skill.name}</span>
                                    {skill.proficiency && (
                                        <span className="text-sm text-gray-600 capitalize">
                                            {skill.proficiency}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((project, index) => (
                                <div key={project.id || index} className="border-l-4 border-gray-300 pl-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    className="text-blue-600 hover:underline text-sm"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {project.url}
                                                </a>
                                            )}
                                        </div>
                                        {project.start_date && (
                                            <div className="text-right text-sm text-gray-600">
                                                <p className="font-medium">{project.start_date} - {project.end_date || 'Present'}</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-2">{project.description}</p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {project.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.highlights && project.highlights.length > 0 && (
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {project.highlights.map((highlight, i) => (
                                                <li key={i}>{highlight}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications Section */}
                {certifications.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Certifications
                        </h2>
                        <div className="space-y-3">
                            {certifications.map((cert, index) => (
                                <div key={cert.id || index} className="border-l-4 border-gray-300 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{cert.name}</h3>
                                            <p className="text-gray-700">{cert.issuer}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            {cert.issue_date && <p>{cert.issue_date}</p>}
                                            {cert.expiry_date && <p>Expires: {cert.expiry_date}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages Section */}
                {languages.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                            Languages
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {languages.map((lang, index) => (
                                <div key={lang.id || index} className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="font-medium text-gray-800">{lang.name}</span>
                                    <span className="text-gray-600 capitalize">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Sections */}
                {custom_sections && custom_sections.length > 0 && (
                    <div className="space-y-6">
                        {custom_sections
                            .sort((a, b) => a.order - b.order)
                            .map((section) => (
                                <div key={section.id}>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
                                        {section.title}
                                    </h2>
                                    <div className="border-l-4 border-gray-300 pl-4">
                                        {section.type === 'text' && (
                                            <p className="text-gray-700">{section.content}</p>
                                        )}
                                        {section.type === 'list' && (
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                                                    <li key={lineIndex}>{line.trim()}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.type === 'table' && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse border border-gray-300">
                                                    <tbody>
                                                        {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => {
                                                            const cells = line.split('|').map(cell => cell.trim());
                                                            return (
                                                                <tr key={lineIndex} className="border-b border-gray-300">
                                                                    {cells.map((cell, cellIndex) => (
                                                                        <td key={cellIndex} className="px-3 py-2 border-r border-gray-300 text-gray-700">
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
