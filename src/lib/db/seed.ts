import { eq } from 'drizzle-orm';
import { db, templates } from '@/lib/db';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Default templates to seed
    const defaultTemplates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'A clean, modern design perfect for tech professionals',
        category: 'modern' as const,
        isPublic: true,
        isPremium: false,
        previewUrl: '/templates/modern-preview.png',
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Classic professional template for traditional industries',
        category: 'professional' as const,
        isPublic: true,
        isPremium: false,
        previewUrl: '/templates/professional-preview.png',
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design for creative professionals',
        category: 'creative' as const,
        isPublic: true,
        isPremium: false,
        previewUrl: '/templates/creative-preview.png',
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple design focusing on content',
        category: 'minimal' as const,
        isPublic: true,
        isPremium: false,
        previewUrl: '/templates/minimal-preview.png',
      },
      {
        id: 'academic',
        name: 'Academic',
        description: 'Traditional academic CV format',
        category: 'academic' as const,
        isPublic: true,
        isPremium: false,
        previewUrl: '/templates/academic-preview.png',
      },
    ];

    console.log('📋 Seeding templates...');

    for (const template of defaultTemplates) {
      try {
        // Check if template already exists
        const existing = await db
          .select()
          .from(templates)
          .where(eq(templates.id, template.id))
          .limit(1);

        if (existing.length === 0) {
          // Insert new template
          await db.insert(templates).values(template);
          console.log(`  ✅ Created template: ${template.name}`);
        } else {
          // Update existing template
          await db
            .update(templates)
            .set({
              name: template.name,
              description: template.description,
              category: template.category,
              isPublic: template.isPublic,
              isPremium: template.isPremium,
              previewUrl: template.previewUrl,
              updatedAt: new Date(),
            })
            .where(eq(templates.id, template.id));
          console.log(`  🔄 Updated template: ${template.name}`);
        }
      } catch (error) {
        console.error(`  ❌ Error seeding template ${template.name}:`, error);
      }
    }

    console.log('✅ Database seeding completed successfully!');

    // Verify seeding
    const allTemplates = await db.select().from(templates);
    console.log(`📊 Total templates in database: ${allTemplates.length}`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
