#!/usr/bin/env node

// Simple test to verify the Drizzle setup is working
import { db, users, templates, resumes } from '../src/lib/db/index.js';
import { eq, count } from 'drizzle-orm';

async function testDrizzleSetup() {
  console.log('🧪 Testing Drizzle ORM setup...\n');

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resumeCount] = await db.select({ count: count() }).from(resumes);
    const [templateCount] = await db.select({ count: count() }).from(templates);

    console.log(`   ✅ Users: ${userCount.count}`);
    console.log(`   ✅ Resumes: ${resumeCount.count}`);
    console.log(`   ✅ Templates: ${templateCount.count}`);

    // Test 2: Check templates
    console.log('\n2. Testing template data...');
    const allTemplates = await db.select().from(templates);
    allTemplates.forEach(template => {
      console.log(`   ✅ ${template.name}: ${template.description}`);
    });

    // Test 3: Test inserting and querying a test user
    console.log('\n3. Testing user operations...');
    const testUser = {
      stackId: 'test-stack-id-' + Date.now(),
      email: 'test@example.com',
      name: 'Test User',
      avatar: null,
    };

    const [newUser] = await db.insert(users).values(testUser).returning();
    console.log(`   ✅ Created test user: ${newUser.name} (${newUser.email})`);

    // Test 4: Test resume creation
    console.log('\n4. Testing resume operations...');
    const testResume = {
      userId: newUser.id,
      templateId: allTemplates[0].id,
      title: 'Test Resume',
      slug: 'test-resume-' + Date.now(),
      content: JSON.stringify({
        personal: {
          full_name: 'Test User',
          email: 'test@example.com',
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        awards: [],
        customSections: [],
      }),
    };

    const [newResume] = await db.insert(resumes).values(testResume).returning();
    console.log(`   ✅ Created test resume: ${newResume.title}`);

    // Test 5: Test querying with joins
    console.log('\n5. Testing complex queries...');
    const resumeWithTemplate = await db
      .select({
        id: resumes.id,
        title: resumes.title,
        templateName: templates.name,
        userName: users.name,
      })
      .from(resumes)
      .leftJoin(templates, eq(resumes.templateId, templates.id))
      .leftJoin(users, eq(resumes.userId, users.id))
      .where(eq(resumes.id, newResume.id))
      .limit(1);

    if (resumeWithTemplate.length > 0) {
      const result = resumeWithTemplate[0];
      console.log(`   ✅ Resume: "${result.title}" by ${result.userName} using ${result.templateName} template`);
    }

    // Cleanup: Delete test data
    console.log('\n6. Cleaning up test data...');
    await db.delete(resumes).where(eq(resumes.id, newResume.id));
    await db.delete(users).where(eq(users.id, newUser.id));
    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Drizzle setup is working perfectly.');
    console.log('\n📊 Final counts:');
    const [finalUserCount] = await db.select({ count: count() }).from(users);
    const [finalResumeCount] = await db.select({ count: count() }).from(resumes);
    const [finalTemplateCount] = await db.select({ count: count() }).from(templates);

    console.log(`   Users: ${finalUserCount.count}`);
    console.log(`   Resumes: ${finalResumeCount.count}`);
    console.log(`   Templates: ${finalTemplateCount.count}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDrizzleSetup()
  .then(() => {
    console.log('\n✅ Drizzle test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Drizzle test failed:', error);
    process.exit(1);
  });
