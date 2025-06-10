import { prisma } from '../prisma';

export class ResumeService {
  /**
   * Create a new resume for a user
   */
  static async createResume(
    userId: string,
    data: {
      title: string;
      templateId: string;
      resumeData?: unknown;
    }
  ) {
    // First verify the template exists
    const template = await prisma.template.findUnique({
      where: { id: data.templateId }
    });
    
    if (!template) {
      throw new Error(`Template with ID ${data.templateId} not found`);
    }

    // First create the resume
    const resume = await prisma.resume.create({
      data: {
        title: data.title,
        templateId: data.templateId,
        userId,
        slug: this.generateSlug(data.title),
      },
    });

    // If resume data is provided, update it (simplified for now)
    if (data.resumeData) {
      await this.updateResumeData(resume.id, data.resumeData);
    }

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
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        awards: { orderBy: { order: 'asc' } },
        customSections: { orderBy: { order: 'asc' } },
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

    return await prisma.resume.findUnique({
      where: whereClause,
      include: {
        template: true,
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        awards: { orderBy: { order: 'asc' } },
        customSections: { orderBy: { order: 'asc' } },
      },
    });
  }

  /**
   * Update resume data (all sections) - simplified for now
   */
  static async updateResumeData(resumeId: string) {
    // For now, just update the resume's updatedAt timestamp
    // TODO: Implement full data mapping later
    await prisma.resume.update({
      where: { id: resumeId },
      data: { updatedAt: new Date() },
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
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        awards: { orderBy: { order: 'asc' } },
        customSections: { orderBy: { order: 'asc' } },
      },
    });
  }
}
