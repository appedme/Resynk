"use client";

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

interface ProfessionalTemplateProps {
  resume: Resume;
  mode: 'desktop' | 'mobile';
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards, customSections, settings } = resume;

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
      className={getMargins()}
      style={{ 
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing === 'compact' ? '1.4' : settings.spacing === 'relaxed' ? '1.8' : '1.6'
      }}
      data-resume-content
    >
      <div className={getSpacing()}>
        {/* Header Section */}
        <div className="text-center border-b-2 pb-6" style={{ borderColor: settings.primaryColor }}>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: settings.primaryColor }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="text-gray-600 space-y-1">
            <div className="flex justify-center space-x-4 text-sm">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>•</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              {personalInfo.linkedin && (
                <span>LinkedIn: {personalInfo.linkedin}</span>
              )}
              {personalInfo.website && personalInfo.linkedin && <span>•</span>}
              {personalInfo.website && (
                <span>Website: {personalInfo.website}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div>
            <h2 
              className="text-xl font-bold mb-3 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <p className="font-semibold text-gray-800">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-medium">{exp.startDate} - {exp.endDate || 'Present'}</p>
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
                  {exp.technologies.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-600">Technologies: </span>
                      <span className="text-sm text-gray-700">{exp.technologies.join(', ')}</span>
                    </div>
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p className="font-medium">{edu.startDate} - {edu.endDate || 'Present'}</p>
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="text-center">
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  {skill.level && (
                    <div className="text-xs text-gray-600 mt-1 capitalize">
                      {skill.level}
                    </div>
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Key Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{project.name}</h3>
                      {project.url && (
                        <p className="text-sm text-blue-600">{project.url}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {project.startDate && (
                        <p>{project.startDate} - {project.endDate || 'Present'}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-600">Technologies: </span>
                      <span className="text-sm text-gray-700">{project.technologies.join(', ')}</span>
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Certifications
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="text-gray-700">{cert.issuer}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {cert.issueDate && <p>Issued: {cert.issueDate}</p>}
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Languages
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="text-center">
                  <p className="font-bold">{lang.language}</p>
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
              className="text-xl font-bold mb-4 border-l-4 pl-3"
              style={{ 
                color: settings.primaryColor,
                borderColor: settings.primaryColor 
              }}
            >
              Awards & Recognition
            </h2>
            <div className="space-y-3">
              {awards.map((award, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{award.title}</h3>
                    <p className="text-gray-700">{award.issuer}</p>
                    {award.description && (
                      <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {award.date && <p>{award.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && 
          customSections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div key={section.id}>
                <h2 
                  className="text-xl font-bold mb-4 border-l-4 pl-3"
                  style={{ 
                    color: settings.primaryColor,
                    borderColor: settings.primaryColor 
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.type === 'list' ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                        <li key={lineIndex}>{line.replace(/^[•\-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  ) : section.type === 'table' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => {
                            const cells = line.split('|').map(cell => cell.trim());
                            return (
                              <tr key={lineIndex} className={lineIndex === 0 ? 'font-bold border-b-2' : 'border-b'} style={{ borderColor: lineIndex === 0 ? settings.primaryColor : '#e5e7eb' }}>
                                {cells.map((cell, cellIndex) => (
                                  <td 
                                    key={cellIndex} 
                                    className={`py-2 pr-6 ${lineIndex === 0 ? 'text-gray-800' : 'text-gray-700'}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-line">
                      {section.content}
                    </div>
                  )}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
