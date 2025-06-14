// Quick test for template service
const { PrismaClient } = require('@prisma/client');

async function testTemplates() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing template service...');

    const templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { name: 'asc' },
    });

    console.log('📋 Templates found:', templates.length);
    templates.forEach(template => {
      console.log(`  - ${template.name} (${template.category})`);
    });

    console.log('✅ Template service test completed');

  } catch (error) {
    console.error('❌ Template service test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTemplates();
