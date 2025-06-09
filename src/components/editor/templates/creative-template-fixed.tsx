"use client";

import type { ResumeData } from "@/types/resume";

interface CreativeTemplateProps {
    resume: ResumeData;
    mode: 'desktop' | 'mobile';
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
    const { personal, experience, education, skills, projects, certifications, languages, custom_sections } = resume;

    // Default styling since settings are not part of ResumeData
    const primaryColor = '#7c3aed'; // violet-600
    const secondaryColor = '#374151'; // gray-700
    const spacing = 'space-y-6';
    const margins = 'p-8';

    // Calculate margins based on settings
    const getMargins = () => {
        return `${margins} bg-gradient-to-br from-gray-50 to-white`;
    };

    return (
        <div className={getMargins()} data-testid="resume-template">
            {/* Header Section with Creative Styling */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 mb-8">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-3">
                        {personal.full_name}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-purple-100 mb-4">
                        <div>📧 {personal.email}</div>
                        {personal.phone && <div>📱 {personal.phone}</div>}
                        {personal.location && <div>📍 {personal.location}</div>}
                        {personal.website && <div>🌐 {personal.website}</div>}
                        {personal.linkedin && <div>💼 {personal.linkedin}</div>}
                    </div>

                    {resume.summary && (
                        <div className="mt-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <p className="text-white leading-relaxed">
                                {resume.summary}
                            </p>
                        </div>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className={spacing}>
                {/* Experience Section */}
                {experience.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                💼
                            </span>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={exp.id || index} className="relative pl-8 border-l-2 border-purple-200">
                                    <div className="absolute w-4 h-4 bg-purple-600 rounded-full -left-2 top-1"></div>
                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                        <p className="text-lg font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'Present'}
                                            {exp.location && ` • ${exp.location}`}
                                        </p>
                                    </div>
                                    {exp.description && (
                                        <div className="text-gray-700 mb-3">
                                            <p>{exp.description}</p>
                                        </div>
                                    )}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="space-y-1 text-gray-700">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-purple-600 mr-2">▸</span>
                                                    {achievement}
                                                </li>
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                🎓
                            </span>
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={edu.id || index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="font-medium" style={{ color: primaryColor }}>{edu.institution}</p>
                                        {edu.field_of_study && <p className="text-gray-600">{edu.field_of_study}</p>}
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p className="font-medium">{edu.start_date} - {edu.end_date || 'Present'}</p>
                                        {edu.gpa && <p className="text-purple-600 font-semibold">GPA: {edu.gpa}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {skills.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                ⚡
                            </span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, index) => (
                                <div key={skill.id || index} className="group">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 font-medium shadow-sm hover:shadow-md transition-shadow">
                                        {skill.name}
                                        {skill.proficiency && (
                                            <span className="ml-2 text-xs text-purple-600 font-semibold">
                                                {skill.proficiency.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                🚀
                            </span>
                            Projects
                        </h2>
                        <div className="grid gap-6">
                            {projects.map((project, index) => (
                                <div key={project.id || index} className="border-l-4 border-purple-300 pl-6 bg-gray-50 rounded-r-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    className="text-purple-600 hover:text-purple-800 underline text-sm"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    🔗 {project.url}
                                                </a>
                                            )}
                                        </div>
                                        {project.start_date && (
                                            <div className="text-right text-sm text-gray-600">
                                                <p>{project.start_date} - {project.end_date || 'Present'}</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-3">{project.description}</p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {project.technologies.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.highlights && project.highlights.length > 0 && (
                                        <ul className="space-y-1 text-gray-700">
                                            {project.highlights.map((highlight, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-purple-600 mr-2">✨</span>
                                                    {highlight}
                                                </li>
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                🏆
                            </span>
                            Certifications
                        </h2>
                        <div className="grid gap-4">
                            {certifications.map((cert, index) => (
                                <div key={cert.id || index} className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{cert.name}</h3>
                                        <p className="text-purple-700 font-medium">{cert.issuer}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        {cert.issue_date && <p className="font-medium">{cert.issue_date}</p>}
                                        {cert.expiry_date && <p>Expires: {cert.expiry_date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages Section */}
                {languages.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                🌍
                            </span>
                            Languages
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {languages.map((lang, index) => (
                                <div key={lang.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-semibold text-gray-800">{lang.name}</span>
                                    <span className="text-purple-600 font-medium capitalize">{lang.proficiency}</span>
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
                                <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: primaryColor }}>
                                        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                                            📝
                                        </span>
                                        {section.title}
                                    </h2>
                                    <div>
                                        {section.type === 'text' && (
                                            <p className="text-gray-700 leading-relaxed">{section.content}</p>
                                        )}
                                        {section.type === 'list' && (
                                            <ul className="space-y-2 text-gray-700">
                                                {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                                                    <li key={lineIndex} className="flex items-start">
                                                        <span className="text-purple-600 mr-2">▸</span>
                                                        {line.trim()}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.type === 'table' && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <tbody>
                                                        {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => {
                                                            const cells = line.split('|').map(cell => cell.trim());
                                                            return (
                                                                <tr key={lineIndex} className="border-b border-purple-100">
                                                                    {cells.map((cell, cellIndex) => (
                                                                        <td key={cellIndex} className="px-4 py-2 text-gray-700">
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
