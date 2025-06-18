import { db, templates } from '@/lib/db';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
  console.log('🌱 Seeding database with templates...');

  const defaultTemplates = [
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

  try {
    for (const template of defaultTemplates) {
      // Check if template exists
      const existing = await db
        .select()
        .from(templates)
        .where(eq(templates.id, template.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(templates).values(template);
        console.log(`✅ Created template: ${template.name}`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    }

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
