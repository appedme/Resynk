import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  stackId: z.string().min(1, 'StackAuth ID is required'),
  email: z.string().email('Valid email is required'),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ stackId: true });

// Template validation schemas
export const createTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  category: z.string().default('professional'),
  isPublic: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  previewUrl: z.string().url().optional(),
});

// Resume validation schemas
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().optional(),
  summary: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string(),
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  location: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  gpa: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  technologies: z.array(z.string()).default([]),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

export const languageSchema = z.object({
  id: z.string(),
  language: z.string().min(1, 'Language is required'),
  proficiency: z.enum(['basic', 'conversational', 'professional', 'native']),
});

export const awardSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Award title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Section content is required'),
  type: z.enum(['text', 'list', 'table']).default('text'),
  order: z.number().default(0),
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  awards: z.array(awardSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export const createResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  resumeData: resumeDataSchema.optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').optional(),
  content: resumeDataSchema.optional(),
  isPublic: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

// Export types
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Award = z.infer<typeof awardSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;
export type CreateResumeData = z.infer<typeof createResumeSchema>;
export type UpdateResumeData = z.infer<typeof updateResumeSchema>;
