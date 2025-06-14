const { PrismaClient } = require('@prisma/client');

async function testResumeCreation() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing resume creation with content field...');

    // First, get a user to test with
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found in database');
      return;
    }

    console.log('Found user:', user.email);

    // Get a template
    const template = await prisma.template.findFirst();
    if (!template) {
      console.log('No templates found in database');
      return;
    }

    console.log('Found template:', template.name);

    // Test creating a resume with content
    const testContent = {
      personalInfo: {
        name: "Test User",
        email: "test@example.com",
        phone: "123-456-7890"
      },
      summary: "Test summary",
      experience: [],
      education: [],
      skills: []
    };

    const resume = await prisma.resume.create({
      data: {
        title: 'Test Resume - ' + new Date().toISOString(),
        userId: user.id,
        templateId: template.id,
        content: JSON.stringify(testContent)
      }
    });

    console.log('✅ Resume created successfully!');
    console.log('Resume ID:', resume.id);
    console.log('Title:', resume.title);
    console.log('Content length:', resume.content?.length || 0);

    // Clean up - delete the test resume
    await prisma.resume.delete({
      where: { id: resume.id }
    });

    console.log('✅ Test resume cleaned up');

  } catch (error) {
    console.error('❌ Error testing resume creation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testResumeCreation();
