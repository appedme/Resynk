// Core resume data types
export interface PersonalInfo {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string; // null for current position
  is_current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  honors?: string[];
  relevant_coursework?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool' | 'other';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  start_date?: string;
  end_date?: string;
  url?: string;
  github_url?: string;
  highlights: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'table';
  order: number;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  certifications: Certification[];
  languages: Language[];
  custom_sections: CustomSection[];
}

export interface ResumeSettings {
  template_id: string;
  color_scheme: string;
  font_family: string;
  font_size: 'small' | 'medium' | 'large';
  page_margin: 'narrow' | 'normal' | 'wide';
  line_spacing: 'compact' | 'normal' | 'relaxed';
  section_spacing: 'compact' | 'normal' | 'relaxed';
  show_icons: boolean;
  show_section_lines: boolean;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  data: ResumeData;
  settings: ResumeSettings;
  is_public: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'minimal' | 'modern' | 'academic';
  industry?: string;
  preview_url: string;
  thumbnail_url: string;
  is_premium: boolean;
  popularity_score: number;
  created_at: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'premium' | 'enterprise';
  usage: {
    resumes_created: number;
    ai_credits_used: number;
    ai_credits_limit: number;
    storage_used: string;
    storage_limit: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    default_template: string;
    auto_save: boolean;
    notifications: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface AIAnalysis {
  ats_score: number;
  missing_keywords: string[];
  suggestions: AISuggestion[];
  match_percentage: number;
  overall_rating: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'keyword' | 'formatting' | 'content' | 'structure';
  section: keyof ResumeData;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  original?: string;
  suggested?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ExportOptions {
  format: 'pdf' | 'html' | 'docx' | 'json';
  quality?: 'draft' | 'standard' | 'high';
  include_links?: boolean;
  page_size?: 'A4' | 'Letter' | 'Legal';
  margins?: 'narrow' | 'normal' | 'wide';
  watermark?: boolean;
}

export interface ResumeAnalytics {
  views: number;
  downloads: number;
  shares: number;
  applications_tracked: number;
  last_viewed: Date;
  view_history: {
    date: string;
    views: number;
    downloads: number;
  }[];
  geographic_data?: {
    country: string;
    views: number;
  }[];
}
