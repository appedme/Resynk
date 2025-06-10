import { prisma } from '../prisma';

export class TemplateService {
  /**
   * Seed default templates
   */
  static async seedDefaultTemplates() {
    const templates = [
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

    for (const template of templates) {
      await prisma.template.upsert({
        where: { id: template.id },
        update: template,
        create: template,
      });
    }
  }

  /**
   * Get all public templates
   */
  static async getPublicTemplates() {
    return await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string) {
    return await prisma.template.findUnique({
      where: { id },
    });
  }
}
