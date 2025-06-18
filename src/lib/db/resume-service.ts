import { eq, desc } from 'drizzle-orm';
import { db, resumes, templates, users, type Resume, type NewResume } from './index';
import { getSampleResumeData } from '@/lib/sample-data';

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
  ): Promise<Resume & { template: any }> {
    // Verify template exists
    const template = await db
      .select()
      .from(templates)
      .where(eq(templates.id, data.templateId))
      .limit(1);

    if (template.length === 0) {
      throw new Error(`Template with ID ${data.templateId} not found`);
    }

    // Use sample data as default, then merge with provided data
    const sampleData = getSampleResumeData();
    const resumeData = data.resumeData || sampleData;

    // Create the resume
    const [newResume] = await db
      .insert(resumes)
      .values({
        title: data.title,
        templateId: data.templateId,
        userId,
        slug: this.generateSlug(data.title),
        content: JSON.stringify(resumeData),
      })
      .returning();

    return {
      ...newResume,
      template: template[0],
    };
  }

  /**
   * Get user's resumes
   */
  static async getUserResumes(userId: string) {
    const userResumes = await db
      .select({
        id: resumes.id,
        userId: resumes.userId,
        title: resumes.title,
        slug: resumes.slug,
        content: resumes.content,
        isPublic: resumes.isPublic,
        isPublished: resumes.isPublished,
        createdAt: resumes.createdAt,
        updatedAt: resumes.updatedAt,
        templateId: templates.id,
        templateName: templates.name,
        templateDescription: templates.description,
        templateCategory: templates.category,
      })
      .from(resumes)
      .leftJoin(templates, eq(resumes.templateId, templates.id))
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));

    return userResumes.map(resume => ({
      ...resume,
      template: {
        id: resume.templateId,
        name: resume.templateName,
        description: resume.templateDescription,
        category: resume.templateCategory,
      },
    }));
  }

  /**
   * Get a complete resume by ID
   */
  static async getCompleteResume(resumeId: string, userId?: string) {
    const query = db
      .select({
        id: resumes.id,
        userId: resumes.userId,
        title: resumes.title,
        slug: resumes.slug,
        content: resumes.content,
        isPublic: resumes.isPublic,
        isPublished: resumes.isPublished,
        createdAt: resumes.createdAt,
        updatedAt: resumes.updatedAt,
        templateId: templates.id,
        templateName: templates.name,
        templateDescription: templates.description,
        templateCategory: templates.category,
      })
      .from(resumes)
      .leftJoin(templates, eq(resumes.templateId, templates.id))
      .where(eq(resumes.id, resumeId));

    if (userId) {
      query.where(eq(resumes.userId, userId));
    }

    const result = await query.limit(1);
    if (result.length === 0) return null;

    const resume = result[0];

    // Parse the JSON content
    let parsedContent = null;
    try {
      parsedContent = resume.content ? JSON.parse(resume.content) : null;
    } catch (error) {
      console.error('Error parsing resume content:', error);
      parsedContent = getSampleResumeData(); // Fallback to sample data
    }

    return {
      ...resume,
      template: {
        id: resume.templateId,
        name: resume.templateName,
        description: resume.templateDescription,
        category: resume.templateCategory,
      },
      data: parsedContent,
    };
  }

  /**
   * Update resume data
   */
  static async updateResumeData(resumeId: string, resumeData: any) {
    await db
      .update(resumes)
      .set({
        content: JSON.stringify(resumeData),
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, resumeId));
  }

  /**
   * Delete a resume
   */
  static async deleteResume(resumeId: string, userId: string) {
    await db
      .delete(resumes)
      .where(eq(resumes.id, resumeId) && eq(resumes.userId, userId));
  }

  /**
   * Generate a URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /**
   * Convert resume to simple format for API responses
   */
  static convertToSimpleFormat(resume: any) {
    return {
      id: resume.id,
      title: resume.title,
      template: resume.template,
      lastModified: resume.updatedAt,
      isAutoSave: false, // We'll add this logic later if needed
    };
  }
}
