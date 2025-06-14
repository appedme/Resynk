import { prisma } from '../prisma';
import { getSampleResumeData } from '../sample-data';

export class ResumeService {
  /**
   * Create a new resume for a user
   */
  static async createResume(
    userId: string,
    data: {
      title: string;
      templateId: string;
      resumeData?: any;
    }
  ) {
    // First verify the template exists
    const template = await prisma.template.findUnique({
      where: { id: data.templateId }
    });

    if (!template) {
      throw new Error(`Template with ID ${data.templateId} not found`);
    }

    // Use sample data as default, then merge with provided data
    const sampleData = getSampleResumeData();
    const resumeData = data.resumeData || sampleData;

    // Create the resume with content
    const resume = await prisma.resume.create({
      data: {
        title: data.title,
        templateId: data.templateId,
        userId,
        slug: this.generateSlug(data.title),
        content: JSON.stringify(resumeData),
      },
      include: {
        template: true,
      },
    });

    return resume;
  }

  /**
   * Get user's resumes
   */
  static async getUserResumes(userId: string) {
    return await prisma.resume.findMany({
      where: { userId },
      include: {
        template: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get a complete resume by ID (with all sections)
   */
  static async getCompleteResume(resumeId: string, userId?: string) {
    const whereClause: { id: string; userId?: string } = { id: resumeId };
    if (userId) {
      whereClause.userId = userId;
    }

    const resume = await prisma.resume.findUnique({
      where: whereClause,
      include: {
        template: true,
      },
    });

    if (!resume) return null;

    // Parse the JSON content
    let parsedContent = null;
    try {
      parsedContent = resume.content ? JSON.parse(resume.content as string) : null;
    } catch (error) {
      console.error('Error parsing resume content:', error);
      parsedContent = getSampleResumeData(); // Fallback to sample data
    }

    return {
      ...resume,
      data: parsedContent,
    };
  }

  /**
   * Update resume data
   */
  static async updateResumeData(resumeId: string, resumeData: any) {
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        content: JSON.stringify(resumeData),
        updatedAt: new Date()
      },
    });
  }

  /**
   * Delete a resume
   */
  static async deleteResume(resumeId: string, userId: string) {
    return await prisma.resume.delete({
      where: { id: resumeId, userId },
    });
  }

  /**
   * Generate a unique slug for a resume
   */
  private static generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Add timestamp to ensure uniqueness
    return `${baseSlug}-${Date.now()}`;
  }

  /**
   * Get public resume by slug
   */
  static async getPublicResume(slug: string) {
    return await prisma.resume.findUnique({
      where: { slug, isPublic: true },
      include: {
        template: true,
      },
    });
  }

  /**
   * Convert database resume to dashboard format
   */
  static convertToSimpleFormat(resume: any) {
    return {
      id: resume.id,
      title: resume.title,
      template: resume.template?.name?.toLowerCase() || 'modern',
      lastModified: formatLastModified(resume.updatedAt),
      status: resume.isPublished ? 'published' : 'draft',
      atsScore: 85, // TODO: Calculate actual ATS score
      views: 0, // TODO: Track views
      downloads: 0, // TODO: Track downloads
      favorite: false, // TODO: Add favorite field to schema
      createdAt: resume.createdAt.toISOString().split('T')[0],
      updatedAt: resume.updatedAt.toISOString().split('T')[0],
      tags: [], // TODO: Extract tags from resume content
    };
  }
}

function formatLastModified(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}
