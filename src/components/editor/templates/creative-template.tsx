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

interface CreativeTemplateProps {
  resume: Resume;
  mode: 'desktop' | 'mobile';
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
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
      className={`${getMargins()} bg-gradient-to-br from-gray-50 to-white`}
      data-testid="resume-template"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.spacing === 'compact' ? '1.4' : settings.spacing === 'relaxed' ? '1.8' : '1.6'
      }}
      data-resume-content
    >
      <div className={getSpacing()}>
        {/* Header Section */}
        <div className="text-center mb-8 bg-white rounded-2xl p-8 shadow-lg border-t-4" style={{ borderColor: settings.primaryColor }}>
          <h1
            className="text-4xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor || settings.primaryColor})`
            }}
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="text-gray-600 space-y-2">
            <div className="flex justify-center flex-wrap gap-4 text-sm">
              {personalInfo.email && <span className="flex items-center gap-1">📧 {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1">📱 {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1">📍 {personalInfo.location}</span>}
            </div>
            <div className="flex justify-center flex-wrap gap-4 text-sm">
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">💼 {personalInfo.linkedin}</span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">🌐 {personalInfo.website}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-4 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              ✨ About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              💼 Professional Journey
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-3" style={{ borderColor: settings.secondaryColor || settings.primaryColor }}>
                  <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-white border-3" style={{ borderColor: settings.primaryColor }}></div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-xl" style={{ color: settings.primaryColor }}>{exp.position}</h3>
                        <p className="font-semibold text-lg text-gray-800">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm">
                        <span
                          className="px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: settings.secondaryColor || settings.primaryColor }}
                        >
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                        {exp.location && <p className="text-gray-600 mt-1">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="bg-gray-50 rounded-lg p-4 mt-3">
                        <ul className="list-none space-y-1 text-gray-700">
                          {exp.description.split('\n').map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-sm mt-1" style={{ color: settings.primaryColor }}>▸</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border"
                            style={{ borderColor: settings.primaryColor }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🚀 Skills & Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-2 text-center hover:shadow-md transition-shadow"
                  style={{ borderColor: settings.primaryColor + '30', backgroundColor: settings.primaryColor + '05' }}
                >
                  <span className="font-bold text-gray-800">{skill.name}</span>
                  {skill.level && (
                    <div className="text-xs mt-1 px-2 py-1 rounded-full text-white" style={{ backgroundColor: settings.secondaryColor || settings.primaryColor }}>
                      {skill.level}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🎓 Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor + '08' }}>
                  <div>
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.institution}</p>
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

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🎨 Featured Projects
            </h2>
            <div className="grid gap-6">
              {projects.map((project, index) => (
                <div key={index} className="p-4 rounded-lg border-l-4" style={{ borderColor: settings.primaryColor, backgroundColor: settings.primaryColor + '05' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{project.name}</h3>
                      {project.url && (
                        <a href={project.url} className="text-sm text-blue-600 hover:underline">{project.url}</a>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {project.startDate && (
                        <p>{project.startDate} - {project.endDate || 'Present'}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs rounded-full text-white"
                          style={{ backgroundColor: settings.secondaryColor || settings.primaryColor }}
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

        {/* Other sections with similar creative styling */}
        {certifications.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🏆 Certifications
            </h2>
            <div className="grid gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start p-3 rounded-lg" style={{ backgroundColor: settings.primaryColor + '08' }}>
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
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🌍 Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="text-center p-3 rounded-lg" style={{ backgroundColor: settings.primaryColor + '08' }}>
                  <p className="font-bold text-lg">{lang.language}</p>
                  <p className="text-sm text-gray-600 capitalize">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {awards.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: settings.primaryColor }}
            >
              🌟 Awards & Recognition
            </h2>
            <div className="space-y-4">
              {awards.map((award, index) => (
                <div key={index} className="flex justify-between items-start p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor + '08' }}>
                  <div>
                    <h3 className="font-bold text-lg">{award.title}</h3>
                    <p className="text-gray-700 font-medium">{award.issuer}</p>
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
              <div key={section.id} className="bg-white rounded-xl p-6 shadow-md">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center gap-2"
                  style={{ color: settings.primaryColor }}
                >
                  📋 {section.title}
                </h2>
                <div className="space-y-3">
                  {section.type === 'list' ? (
                    <ul className="space-y-2">
                      {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                        <li key={lineIndex} className="flex items-start gap-2">
                          <span className="text-sm mt-1" style={{ color: settings.primaryColor }}>▸</span>
                          <span className="text-gray-700">{line.replace(/^[•\-\*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : section.type === 'table' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => {
                            const cells = line.split('|').map(cell => cell.trim());
                            return (
                              <tr key={lineIndex} className={lineIndex === 0 ? 'font-bold' : ''}>
                                {cells.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`py-2 pr-6 ${lineIndex === 0 ? 'text-gray-800 border-b-2' : 'text-gray-700'}`}
                                    style={{ borderColor: lineIndex === 0 ? settings.primaryColor : 'transparent' }}
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
                    <div className="text-gray-700 whitespace-pre-line bg-gray-50 rounded-lg p-4">
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
