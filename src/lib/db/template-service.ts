import { eq } from 'drizzle-orm';
import { db, templates, type Template, type NewTemplate } from './index';

export class TemplateService {
  /**
   * Seed default templates
   */
  static async seedDefaultTemplates() {
    const defaultTemplates: NewTemplate[] = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'A clean, modern design perfect for tech professionals',
        category: 'professional',
        isPublic: true,
        isPremium: false,
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Classic professional template for traditional industries',
        category: 'professional',
        isPublic: true,
        isPremium: false,
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design for creative professionals',
        category: 'creative',
        isPublic: true,
        isPremium: false,
      },
    ];

    for (const template of defaultTemplates) {
      // Check if template already exists
      const existing = await db
        .select()
        .from(templates)
        .where(eq(templates.id, template.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(templates).values(template);
      }
    }
  }

  /**
   * Get all public templates
   */
  static async getPublicTemplates(): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(templates.name);
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string): Promise<Template | null> {
    const result = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1);

    return result[0] || null;
  }
}
