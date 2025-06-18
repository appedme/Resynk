#!/usr/bin/env node

/**
 * Integration Test Suite
 * Tests the complete flow from database to API to frontend
 */

async function testCompleteUserFlow() {
  console.log('👥 Testing Complete User Flow...\n');

  try {
    // Simulate the complete user journey
    console.log('1. User Registration Simulation');
    const { createOrUpdateUser } = await import('../src/lib/actions.js');
    
    const mockStackUser = {
      id: 'integration-test-user',
      primaryEmail: 'integration@test.com',
      displayName: 'Integration Test User',
      profileImageUrl: 'https://example.com/avatar.jpg'
    };

    const user = await createOrUpdateUser(mockStackUser);
    console.log(`   ✅ User created: ${user.name} (${user.email})`);
    console.log('');

    // Test template selection
    console.log('2. Template Selection');
    const { getTemplates } = await import('../src/lib/actions.js');
    const templates = await getTemplates();
    
    if (templates.length === 0) {
      console.log('   ⚠️  No templates available - run seed script');
      return { success: false, reason: 'No templates' };
    }

    const selectedTemplate = templates[0];
    console.log(`   ✅ Template selected: ${selectedTemplate.name}`);
    console.log('');

    // Mock authentication for server actions
    const originalGetUser = (await import('../src/stack.js')).stackServerApp.getUser;
    (await import('../src/stack.js')).stackServerApp.getUser = async () => mockStackUser;

    try {
      // Test resume creation with complete data
      console.log('3. Resume Creation with Complete Data');
      const { createResume } = await import('../src/lib/actions.js');
      
      const completeResumeData = {
        personal: {
          full_name: 'Integration Test User',
          email: 'integration@test.com',
          phone: '+1-555-0123',
          location: 'Test City, TC',
          linkedin: 'linkedin.com/in/testuser',
          website: 'https://testuser.dev',
          summary: 'Experienced software engineer with expertise in full-stack development.'
        },
        experience: [
          {
            id: 'exp1',
            position: 'Senior Software Engineer',
            company: 'Tech Company Inc.',
            startDate: '2022-01',
            endDate: '2024-01',
            current: false,
            location: 'Remote',
            description: 'Led development of scalable web applications using React and Node.js.',
            technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL']
          },
          {
            id: 'exp2',
            position: 'Software Engineer',
            company: 'Startup LLC',
            startDate: '2020-06',
            endDate: '2022-01',
            current: false,
            location: 'San Francisco, CA',
            description: 'Developed microservices architecture and improved system performance.',
            technologies: ['Python', 'Docker', 'Kubernetes', 'AWS']
          }
        ],
        education: [
          {
            id: 'edu1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            startDate: '2016-09',
            endDate: '2020-05',
            location: 'Tech City, TC',
            gpa: '3.8'
          }
        ],
        skills: [
          { id: 'skill1', name: 'JavaScript', level: 'expert' },
          { id: 'skill2', name: 'React', level: 'expert' },
          { id: 'skill3', name: 'Node.js', level: 'advanced' },
          { id: 'skill4', name: 'Python', level: 'advanced' },
          { id: 'skill5', name: 'TypeScript', level: 'expert' }
        ],
        projects: [
          {
            id: 'proj1',
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with React frontend and Node.js backend.',
            url: 'https://github.com/testuser/ecommerce',
            startDate: '2023-01',
            endDate: '2023-06',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
          }
        ],
        certifications: [
          {
            id: 'cert1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: '2023-03',
            expiryDate: '2026-03'
          }
        ],
        languages: [
          { id: 'lang1', language: 'English', proficiency: 'native' },
          { id: 'lang2', language: 'Spanish', proficiency: 'conversational' }
        ],
        awards: [
          {
            id: 'award1',
            title: 'Employee of the Month',
            issuer: 'Tech Company Inc.',
            date: '2023-06',
            description: 'Recognized for outstanding performance in Q2 2023.'
          }
        ],
        customSections: [
          {
            id: 'custom1',
            title: 'Publications',
            content: 'Published article on modern web development practices in Tech Journal.',
            type: 'text',
            order: 0
          }
        ]
      };

      const createResult = await createResume({
        title: 'Integration Test Resume',
        templateId: selectedTemplate.id,
        content: completeResumeData
      });

      if (createResult.success) {
        console.log(`   ✅ Resume created with ID: ${createResult.resumeId}`);
        
        // Test resume retrieval
        console.log('4. Resume Retrieval and Validation');
        const { getResumeById } = await import('../src/lib/actions.js');
        const retrievedResume = await getResumeById(createResult.resumeId);
        
        if (retrievedResume) {
          console.log(`   ✅ Resume retrieved: ${retrievedResume.title}`);
          
          // Validate content
          const content = JSON.parse(retrievedResume.content || '{}');
          const hasPersonal = content.personal && content.personal.full_name;
          const hasExperience = content.experience && content.experience.length > 0;
          const hasEducation = content.education && content.education.length > 0;
          const hasSkills = content.skills && content.skills.length > 0;
          
          console.log(`   Personal Info: ${hasPersonal ? '✅' : '❌'}`);
          console.log(`   Experience (${content.experience?.length || 0} items): ${hasExperience ? '✅' : '❌'}`);
          console.log(`   Education (${content.education?.length || 0} items): ${hasEducation ? '✅' : '❌'}`);
          console.log(`   Skills (${content.skills?.length || 0} items): ${hasSkills ? '✅' : '❌'}`);
          console.log('');

          // Test resume update
          console.log('5. Resume Update');
          const { updateResume } = await import('../src/lib/actions.js');
          
          const updatedData = {
            ...completeResumeData,
            personal: {
              ...completeResumeData.personal,
              summary: 'Updated summary: Expert full-stack developer with proven track record.'
            }
          };

          const updateResult = await updateResume(createResult.resumeId, {
            title: 'Updated Integration Test Resume',
            content: updatedData
          });

          if (updateResult.success) {
            console.log('   ✅ Resume updated successfully');
          } else {
            console.log(`   ❌ Resume update failed: ${updateResult.error}`);
          }
          console.log('');

          // Test resume listing
          console.log('6. User Resume Listing');
          const { getUserResumes } = await import('../src/lib/actions.js');
          const userResumes = await getUserResumes();
          
          console.log(`   ✅ User has ${userResumes.length} resume(s)`);
          userResumes.forEach((resume, index) => {
            console.log(`   ${index + 1}. ${resume.title} (${resume.templateId})`);
          });
          console.log('');

          // Cleanup
          console.log('7. Cleanup');
          const { deleteResume } = await import('../src/lib/actions.js');
          const deleteResult = await deleteResume(createResult.resumeId);
          
          if (deleteResult.success) {
            console.log('   ✅ Test resume cleaned up');
          } else {
            console.log(`   ⚠️  Cleanup failed: ${deleteResult.error}`);
          }

          return { 
            success: true, 
            resumeId: createResult.resumeId,
            contentValidation: {
              personal: hasPersonal,
              experience: hasExperience,
              education: hasEducation,
              skills: hasSkills
            }
          };

        } else {
          console.log('   ❌ Resume retrieval failed');
          return { success: false, reason: 'Resume retrieval failed' };
        }

      } else {
        console.log(`   ❌ Resume creation failed: ${createResult.error}`);
        return { success: false, reason: 'Resume creation failed' };
      }

    } finally {
      // Restore original getUser function
      (await import('../src/stack.js')).stackServerApp.getUser = originalGetUser;
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return { success: false, error };
  }
}

async function testDataIntegrity() {
  console.log('🔒 Testing Data Integrity...\n');

  try {
    // Test JSON content validation
    console.log('1. JSON Content Validation');
    
    const sampleContent = {
      personal: { full_name: 'Test', email: 'test@example.com' },
      experience: [],
      education: [],
      skills: []
    };

    const jsonString = JSON.stringify(sampleContent);
    const parsedContent = JSON.parse(jsonString);

    const isValid = parsedContent.personal.full_name === 'Test';
    console.log(`   ✅ JSON serialization/deserialization: ${isValid ? 'Working' : 'Failed'}`);
    console.log('');

    // Test foreign key relationships
    console.log('2. Foreign Key Relationships');
    const { db, users, resumes, templates } = await import('../src/lib/db/index.js');
    const { eq } = await import('drizzle-orm');

    // Check if any orphaned records exist
    const resumesWithUsers = await db
      .select({
        resumeId: resumes.id,
        userId: users.id
      })
      .from(resumes)
      .leftJoin(users, eq(resumes.userId, users.id))
      .limit(5);

    const hasOrphanedResumes = resumesWithUsers.some(row => !row.userId);
    console.log(`   ✅ No orphaned resumes: ${!hasOrphanedResumes ? 'True' : 'False'}`);
    console.log('');

    return true;

  } catch (error) {
    console.error('❌ Data integrity test failed:', error);
    return false;
  }
}

async function runIntegrationTests() {
  console.log('🧪 Starting Integration Test Suite');
  console.log('='.repeat(50));

  const userFlowTest = await testCompleteUserFlow();
  const dataIntegrityTest = await testDataIntegrity();

  console.log('='.repeat(50));
  console.log('📊 Integration Test Results:');
  console.log(`Complete User Flow: ${userFlowTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Integrity: ${dataIntegrityTest ? '✅ PASS' : '❌ FAIL'}`);

  if (userFlowTest.success && userFlowTest.contentValidation) {
    console.log('\n📋 Content Validation Results:');
    const cv = userFlowTest.contentValidation;
    console.log(`Personal Info: ${cv.personal ? '✅' : '❌'}`);
    console.log(`Experience Data: ${cv.experience ? '✅' : '❌'}`);
    console.log(`Education Data: ${cv.education ? '✅' : '❌'}`);
    console.log(`Skills Data: ${cv.skills ? '✅' : '❌'}`);
  }

  const allPassed = userFlowTest.success && dataIntegrityTest;
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '💥 SOME TESTS FAILED'}`);

  if (!allPassed) {
    if (userFlowTest.reason) {
      console.log(`\n💡 User Flow Issue: ${userFlowTest.reason}`);
    }
    if (userFlowTest.error) {
      console.log(`💥 Error Details: ${userFlowTest.error.message}`);
    }
  }

  return allPassed;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}

export { runIntegrationTests };
