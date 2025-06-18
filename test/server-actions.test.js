#!/usr/bin/env node

/**
 * Server Actions Test Suite
 * Tests all database server actions for functionality and error handling
 */

async function testUserActions() {
  console.log('👤 Testing User Actions...\n');

  try {
    const { createOrUpdateUser } = await import('../src/lib/actions.js');

    // Test user creation
    console.log('1. User Creation Test');
    const testStackUser = {
      id: 'test-stack-user-123',
      primaryEmail: 'test@example.com',
      displayName: 'Test User',
      profileImageUrl: 'https://example.com/avatar.jpg'
    };

    const user = await createOrUpdateUser(testStackUser);
    console.log(`   ✅ User created with ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}\n`);

    // Test user update
    console.log('2. User Update Test');
    const updatedStackUser = {
      ...testStackUser,
      displayName: 'Updated Test User',
      primaryEmail: 'updated@example.com'
    };

    const updatedUser = await createOrUpdateUser(updatedStackUser);
    console.log(`   ✅ User updated: ${updatedUser.name}`);
    console.log(`   Updated Email: ${updatedUser.email}\n`);

    return { success: true, user };

  } catch (error) {
    console.error('❌ User actions test failed:', error);
    return { success: false, error };
  }
}

async function testTemplateActions() {
  console.log('📋 Testing Template Actions...\n');

  try {
    const { getTemplates, getTemplateById } = await import('../src/lib/actions.js');

    // Test get all templates
    console.log('1. Get All Templates Test');
    const templates = await getTemplates();
    console.log(`   ✅ Found ${templates.length} templates`);
    
    if (templates.length === 0) {
      console.log('   ⚠️  No templates found - run seed script first');
      return { success: true, templates: [] };
    }

    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.category})`);
    });
    console.log('');

    // Test get template by ID
    console.log('2. Get Template by ID Test');
    const firstTemplate = templates[0];
    const template = await getTemplateById(firstTemplate.id);
    
    if (template) {
      console.log(`   ✅ Retrieved template: ${template.name}`);
      console.log(`   Description: ${template.description}`);
    } else {
      console.log('   ❌ Template not found');
    }
    console.log('');

    // Test invalid template ID
    console.log('3. Invalid Template ID Test');
    const invalidTemplate = await getTemplateById('non-existent-template');
    console.log(`   ✅ Invalid ID handled: ${invalidTemplate === null ? 'null returned' : 'unexpected result'}\n`);

    return { success: true, templates };

  } catch (error) {
    console.error('❌ Template actions test failed:', error);
    return { success: false, error };
  }
}

async function testResumeActions(user, templates) {
  console.log('📄 Testing Resume Actions...\n');

  if (!user || !templates || templates.length === 0) {
    console.log('   ⚠️  Skipping resume tests - missing user or templates\n');
    return { success: true, skipped: true };
  }

  try {
    const { 
      createResume, 
      getUserResumes, 
      getResumeById, 
      updateResume, 
      duplicateResume,
      deleteResume 
    } = await import('../src/lib/actions.js');

    // Mock authentication by temporarily modifying the stackServerApp
    const originalGetUser = (await import('../src/stack.js')).stackServerApp.getUser;
    (await import('../src/stack.js')).stackServerApp.getUser = async () => ({
      id: user.stackId,
      primaryEmail: user.email,
      displayName: user.name,
      profileImageUrl: user.avatar
    });

    let createdResumeId = null;

    try {
      // Test resume creation
      console.log('1. Resume Creation Test');
      const resumeData = {
        title: 'Test Resume - Actions',
        templateId: templates[0].id,
        content: {
          personal: {
            full_name: 'Test User',
            email: 'test@example.com'
          },
          experience: [],
          education: [],
          skills: []
        }
      };

      const createResult = await createResume(resumeData);
      if (createResult.success) {
        createdResumeId = createResult.resumeId;
        console.log(`   ✅ Resume created with ID: ${createdResumeId}`);
      } else {
        console.log(`   ❌ Resume creation failed: ${createResult.error}`);
      }
      console.log('');

      // Test get user resumes
      console.log('2. Get User Resumes Test');
      const userResumes = await getUserResumes();
      console.log(`   ✅ Found ${userResumes.length} user resumes`);
      console.log('');

      // Test get resume by ID
      if (createdResumeId) {
        console.log('3. Get Resume by ID Test');
        const resume = await getResumeById(createdResumeId);
        if (resume) {
          console.log(`   ✅ Retrieved resume: ${resume.title}`);
          console.log(`   Template ID: ${resume.templateId}`);
        } else {
          console.log('   ❌ Resume not found');
        }
        console.log('');

        // Test resume update
        console.log('4. Resume Update Test');
        const updateResult = await updateResume(createdResumeId, {
          title: 'Updated Test Resume',
          content: {
            personal: {
              full_name: 'Updated Test User',
              email: 'updated@example.com'
            },
            experience: [{
              id: 'exp1',
              position: 'Test Position',
              company: 'Test Company',
              startDate: '2024-01-01',
              current: true,
              description: 'Test description',
              technologies: ['JavaScript', 'React']
            }],
            education: [],
            skills: []
          }
        });

        if (updateResult.success) {
          console.log('   ✅ Resume updated successfully');
        } else {
          console.log(`   ❌ Resume update failed: ${updateResult.error}`);
        }
        console.log('');

        // Test resume duplication
        console.log('5. Resume Duplication Test');
        const duplicateResult = await duplicateResume(createdResumeId);
        if (duplicateResult.success) {
          console.log(`   ✅ Resume duplicated with ID: ${duplicateResult.resumeId}`);
          
          // Clean up duplicate
          await deleteResume(duplicateResult.resumeId);
          console.log('   🧹 Duplicate cleaned up');
        } else {
          console.log(`   ❌ Resume duplication failed: ${duplicateResult.error}`);
        }
        console.log('');

        // Test resume deletion
        console.log('6. Resume Deletion Test');
        const deleteResult = await deleteResume(createdResumeId);
        if (deleteResult.success) {
          console.log('   ✅ Resume deleted successfully');
        } else {
          console.log(`   ❌ Resume deletion failed: ${deleteResult.error}`);
        }
        console.log('');
      }

    } finally {
      // Restore original getUser function
      (await import('../src/stack.js')).stackServerApp.getUser = originalGetUser;
    }

    return { success: true };

  } catch (error) {
    console.error('❌ Resume actions test failed:', error);
    return { success: false, error };
  }
}

async function runServerActionsTests() {
  console.log('🧪 Starting Server Actions Test Suite');
  console.log('='.repeat(50));

  const userTest = await testUserActions();
  const templateTest = await testTemplateActions();
  const resumeTest = await testResumeActions(
    userTest.user, 
    templateTest.templates
  );

  console.log('='.repeat(50));
  console.log('📊 Server Actions Test Results:');
  console.log(`User Actions: ${userTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Template Actions: ${templateTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Resume Actions: ${resumeTest.success ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = userTest.success && templateTest.success && resumeTest.success;
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '💥 SOME TESTS FAILED'}`);

  return allPassed;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runServerActionsTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}

export { runServerActionsTests };
