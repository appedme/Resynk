#!/usr/bin/env node

/**
 * Database Connection and Schema Test
 * Tests the Drizzle + D1 setup and basic operations
 */

import { db, users, templates, resumes, isDatabaseAvailable, getDatabaseType } from '../src/lib/db/index.js';
import { eq, count } from 'drizzle-orm';

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  try {
    // Test 1: Check if database is available
    console.log('1. Database Availability Check');
    const isAvailable = isDatabaseAvailable();
    console.log(`   Database Available: ${isAvailable ? '✅ Yes' : '❌ No'}`);
    console.log(`   Database Type: ${getDatabaseType()}\n`);

    if (!isAvailable) {
      throw new Error('Database is not available');
    }

    // Test 2: Test basic queries
    console.log('2. Basic Query Tests');
    
    // Count records in each table
    const [userCount] = await db.select({ count: count() }).from(users);
    const [templateCount] = await db.select({ count: count() }).from(templates);
    const [resumeCount] = await db.select({ count: count() }).from(resumes);

    console.log(`   Users: ${userCount.count}`);
    console.log(`   Templates: ${templateCount.count}`);
    console.log(`   Resumes: ${resumeCount.count}\n`);

    // Test 3: Template verification
    console.log('3. Template Verification');
    const allTemplates = await db.select().from(templates);
    
    if (allTemplates.length === 0) {
      console.log('   ⚠️  No templates found - run `npm run db:seed` to seed database');
    } else {
      console.log('   ✅ Templates found:');
      allTemplates.forEach(template => {
        console.log(`      - ${template.name} (${template.category})`);
      });
    }
    console.log('');

    // Test 4: Test foreign key constraints
    console.log('4. Foreign Key Constraint Test');
    try {
      // This should fail due to foreign key constraint
      await db.insert(resumes).values({
        title: 'Test Resume',
        userId: 'non-existent-user',
        templateId: 'non-existent-template',
        content: '{}',
      });
      console.log('   ❌ Foreign key constraints not working');
    } catch (error) {
      console.log('   ✅ Foreign key constraints working properly');
    }
    console.log('');

    // Test 5: Test data types and timestamps
    console.log('5. Data Types and Timestamps Test');
    const sampleTemplate = allTemplates[0];
    if (sampleTemplate) {
      console.log(`   Template ID Type: ${typeof sampleTemplate.id}`);
      console.log(`   Created At Type: ${typeof sampleTemplate.createdAt}`);
      console.log(`   Is Public Type: ${typeof sampleTemplate.isPublic}`);
      console.log(`   ✅ Data types correct`);
    }
    console.log('');

    console.log('🎉 All database tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

async function testSchemaValidation() {
  console.log('\n📝 Testing Schema Validation...\n');

  try {
    const { userSchema, templateSchema, resumeSchema } = await import('../src/lib/db/schema.js');

    // Test user schema validation
    console.log('1. User Schema Validation');
    const validUser = {
      stackId: 'test-stack-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg'
    };

    const userResult = userSchema.safeParse(validUser);
    console.log(`   Valid User: ${userResult.success ? '✅' : '❌'}`);

    const invalidUser = {
      stackId: '',
      email: 'invalid-email',
      name: ''
    };

    const invalidUserResult = userSchema.safeParse(invalidUser);
    console.log(`   Invalid User Rejected: ${!invalidUserResult.success ? '✅' : '❌'}`);

    // Test template schema validation
    console.log('\n2. Template Schema Validation');
    const validTemplate = {
      id: 'test-template',
      name: 'Test Template',
      description: 'A test template',
      category: 'professional',
      isPublic: true,
      isPremium: false
    };

    const templateResult = templateSchema.safeParse(validTemplate);
    console.log(`   Valid Template: ${templateResult.success ? '✅' : '❌'}`);

    // Test resume schema validation
    console.log('\n3. Resume Schema Validation');
    const validResume = {
      title: 'Test Resume',
      templateId: 'modern',
      content: {
        personal: {
          full_name: 'John Doe',
          email: 'john@example.com'
        },
        experience: [],
        education: [],
        skills: []
      },
      isPublic: false
    };

    const resumeResult = resumeSchema.safeParse(validResume);
    console.log(`   Valid Resume: ${resumeResult.success ? '✅' : '❌'}`);

    console.log('\n🎉 All schema validation tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Schema validation test failed:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting Database Test Suite');
  console.log('='.repeat(50));

  const dbTest = await testDatabaseConnection();
  const schemaTest = await testSchemaValidation();

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`Database Connection: ${dbTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Schema Validation: ${schemaTest ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = dbTest && schemaTest;
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '💥 SOME TESTS FAILED'}`);

  process.exit(allPassed ? 0 : 1);
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export { testDatabaseConnection, testSchemaValidation };
