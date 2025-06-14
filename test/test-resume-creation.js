const { PrismaClient } = require('@prisma/client');
const { getSampleResumeData } = require('../src/lib/sample-data');

async function testResumeCreation() {
  const prisma = new PrismaClient();

  try {
    console.log('🔧 Testing resume creation...');

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email: 'shaswatraj3@gmail.com' }
    });

    if (!user) {
      console.error('❌ User not found');
      return;
    }

    console.log('👤 Found user:', user.name, user.email);

    // Get sample data
    const sampleData = getSampleResumeData();
    console.log('📄 Sample data prepared');

    // Create a resume
    const resume = await prisma.resume.create({
      data: {
        title: 'Test Resume - Database Direct',
        templateId: 'modern',
        userId: user.id,
        slug: 'test-resume-database-direct',
        content: JSON.stringify(sampleData),
      },
      include: {
        template: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
    });

    console.log('✅ Resume created successfully:');
    console.log('  ID:', resume.id);
    console.log('  Title:', resume.title);
    console.log('  Template:', resume.template.name);
    console.log('  User:', resume.user.name);
    console.log('  Content length:', resume.content ? resume.content.length : 0, 'characters');

    // Verify the content is valid JSON
    if (resume.content) {
      try {
        const parsedContent = JSON.parse(resume.content);
        console.log('✅ Content is valid JSON with keys:', Object.keys(parsedContent));
      } catch (error) {
        console.error('❌ Content is not valid JSON:', error.message);
      }
    }

  } catch (error) {
    console.error('💥 Error creating resume:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testResumeCreation();
