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
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
        </h1>
        <p className="text-gray-600">Professional Template (Coming Soon)</p>
      </div>
      
      {/* Placeholder content */}
      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
          <p className="text-gray-700">{resume.personalInfo.summary || "Professional summary will appear here..."}</p>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-4">
          <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
          <div className="text-sm text-gray-600 space-y-1">
            {resume.personalInfo.email && <p>Email: {resume.personalInfo.email}</p>}
            {resume.personalInfo.phone && <p>Phone: {resume.personalInfo.phone}</p>}
            {resume.personalInfo.location && <p>Location: {resume.personalInfo.location}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
