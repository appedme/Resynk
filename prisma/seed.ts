import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed default templates
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

  console.log('Seeding templates...');
  
  for (const template of templates) {
    const result = await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
    console.log(`✓ Template: ${result.name}`);
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
