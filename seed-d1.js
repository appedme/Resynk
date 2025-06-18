// Simple seeding script for D1 database
import { getDB } from './src/lib/db/index.js';
import { templates } from './src/lib/db/schema.js';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    const db = getDB();

    // Seed default templates
    const defaultTemplates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'A clean, modern design perfect for tech professionals',
        category: 'modern',
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
      await db.insert(templates).values(template).onConflictDoNothing();
      console.log(`✅ Seeded template: ${template.name}`);
    }

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();
