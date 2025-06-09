"use client";

import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

// Editor-specific Resume interface
interface Resume {
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

interface ModernTemplateProps {
  resume: Resume;
  mode: 'desktop' | 'mobile';
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards, settings } = resume;

  // Calculate spacing based on settings
  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return 'space-y-4';
      case 'relaxed': return 'space-y-8';
      default: return 'space-y-6';
    }
  };

  // Calculate margins based on settings
  const getMargins = () => {
    switch (settings.pageMargins) {
      case 'narrow': return 'p-4';
      case 'wide': return 'p-12';
      default: return 'p-8';
    }
  };

  return (
    <div 
      className="max-w-none mx-auto bg-white shadow-lg"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        color: settings.secondaryColor,
      }}
    >
      <div className={`${getMargins()} ${getSpacing()}`}>
        {/* Header Section */}
        <div className="text-center border-b pb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: settings.primaryColor }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          
          <div 
            className="flex flex-wrap justify-center gap-4 text-sm"
            style={{ color: settings.secondaryColor }}
          >
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          <div 
            className="flex flex-wrap justify-center gap-4 text-sm mt-2"
            style={{ color: settings.secondaryColor }}
          >
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          {personalInfo.summary && (
            <p 
              className="mt-4 max-w-2xl mx-auto leading-relaxed"
              style={{ color: settings.secondaryColor }}
            >
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Experience Section */}
        {experience.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: settings.primaryColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {exp.description.split('\n').map((item, i) => (
                        <li key={i}>{item}</li>
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
              style={{ color: resume.settings.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{edu.startDate} - {edu.endDate || 'Present'}</p>
                    {edu.location && <p>{edu.location}</p>}
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
              style={{ color: resume.settings.primaryColor }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill.name}
                  {skill.level && skill.level !== 'beginner' && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: resume.settings.primaryColor }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} className="text-blue-600 text-sm">
                          {project.url}
                        </a>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {project.startDate && (
                        <p>{project.startDate} - {project.endDate || 'Present'}</p>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-700">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
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

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: resume.settings.primaryColor }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {cert.issueDate && <p>{cert.issueDate}</p>}
                    {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
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
              style={{ color: resume.settings.primaryColor }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold">{lang.language}</p>
                  <p className="text-sm text-gray-600 capitalize">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b"
              style={{ color: resume.settings.primaryColor }}
            >
              Awards & Achievements
            </h2>
            <div className="space-y-2">
              {awards.map((award, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{award.title}</h3>
                    <p className="text-gray-600">{award.issuer}</p>
                    {award.description && (
                      <p className="text-sm text-gray-700 mt-1">{award.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {award.date && <p>{award.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
