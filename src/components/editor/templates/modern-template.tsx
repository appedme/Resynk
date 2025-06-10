"use client";

import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import type { ResumeData, PersonalInfo } from "@/types/resume";

interface ModernTemplateProps {
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
}

export function ModernTemplate({ resume, settings }: ModernTemplateProps) {
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

  return (
    <div className={`max-w-none mx-auto bg-white shadow-lg ${marginsClass} ${spacingClass}`} data-testid="resume-template" style={{ fontFamily: settings?.fontFamily }}>
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          {personal.full_name || 'Your Name'}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4" style={{ color: secondaryColor }}>
          {personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{personal.website}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{personal.linkedin}</span>
            </div>
          )}
        </div>

        {resume.summary && (
          <p
            className="mt-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: secondaryColor }}
          >
            {resume.summary}
          </p>
        )}
      </div>

      {/* Experience Section */}
      {experience.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'Present'}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700">
                    <p>{exp.description}</p>
                  </div>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.field_of_study && <p className="text-gray-500 text-sm">{edu.field_of_study}</p>}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{edu.start_date} - {edu.end_date || 'Present'}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill, index) => (
              <div key={skill.id || index} className="flex items-center justify-between">
                <span className="text-gray-700">{skill.name}</span>
                {skill.proficiency && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({skill.proficiency})
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
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={project.id || index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
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
                    <div className="text-right text-sm text-gray-500">
                      <p>{project.start_date} - {project.end_date || 'Present'}</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {cert.issue_date && <p>{cert.issue_date}</p>}
                  {cert.expiry_date && <p>Expires: {cert.expiry_date}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages Section */}
      {languages.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang, index) => (
              <div key={lang.id || index} className="flex justify-between">
                <p className="font-semibold">{lang.name}</p>
                <p className="text-gray-500 capitalize">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards & Achievements Section */}
      {achievements && achievements.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b"
            style={{ color: primaryColor }}
          >
            Awards & Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={achievement.id || index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.issuer}</p>
                  </div>
                  {achievement.date && (
                    <div className="text-right text-sm text-gray-500">
                      <p>{achievement.date}</p>
                    </div>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-gray-700">{achievement.description}</p>
                )}
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
                <h2
                  className="text-xl font-bold mb-4 pb-2 border-b"
                  style={{ color: primaryColor }}
                >
                  {section.title}
                </h2>
                <div className="space-y-2">
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
                      <table className="w-full border-collapse">
                        <tbody>
                          {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => {
                            const cells = line.split('|').map(cell => cell.trim());
                            return (
                              <tr key={lineIndex} className="border-b">
                                {cells.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-2 py-1 border-r">
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
  );
}
