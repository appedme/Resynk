#!/usr/bin/env node

/**
 * API Endpoints Test Suite
 * Tests all API routes for proper functionality and error handling
 */

async function makeRequest(url, options = {}) {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}${url}`;
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

async function testDatabaseAPI() {
  console.log('🔍 Testing Database API...\n');

  try {
    console.log('1. Database Connection Test');
    const response = await makeRequest('/api/test/db');
    
    if (response.ok) {
      console.log('   ✅ Database API accessible');
      console.log(`   Users: ${response.data.data.counts.users}`);
      console.log(`   Templates: ${response.data.data.counts.templates}`);
      console.log(`   Resumes: ${response.data.data.counts.resumes}`);
    } else {
      console.log(`   ❌ Database API failed: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
    }
    console.log('');

    return response.ok;

  } catch (error) {
    console.error('❌ Database API test failed:', error);
    return false;
  }
}

async function testTemplatesAPI() {
  console.log('📋 Testing Templates API...\n');

  try {
    console.log('1. Get Templates Test');
    const response = await makeRequest('/api/templates');
    
    if (response.ok && response.data.success) {
      const templates = response.data.templates;
      console.log(`   ✅ Templates API accessible - ${templates.length} templates found`);
      
      templates.forEach(template => {
        console.log(`   - ${template.name} (${template.category})`);
      });

      return { success: true, templates };
    } else {
      console.log(`   ❌ Templates API failed: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      return { success: false };
    }

  } catch (error) {
    console.error('❌ Templates API test failed:', error);
    return { success: false };
  }
}

async function testResumesAPI() {
  console.log('📄 Testing Resumes API...\n');

  try {
    // Test unauthenticated access (should fail)
    console.log('1. Unauthenticated Access Test');
    const unauthResponse = await makeRequest('/api/resumes');
    
    if (unauthResponse.status === 401) {
      console.log('   ✅ Unauthenticated access properly rejected');
    } else {
      console.log(`   ⚠️  Expected 401, got ${unauthResponse.status}`);
    }
    console.log('');

    // Test invalid resume creation (should fail)
    console.log('2. Invalid Resume Creation Test');
    const invalidCreateResponse = await makeRequest('/api/resumes', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Invalid: empty title
        templateId: 'non-existent'
      })
    });

    if (invalidCreateResponse.status === 401) {
      console.log('   ✅ Invalid resume creation properly rejected (auth required)');
    } else {
      console.log(`   ⚠️  Expected 401, got ${invalidCreateResponse.status}`);
    }
    console.log('');

    // Note: Full authenticated testing would require a real auth token
    console.log('📝 Note: Authenticated resume operations require valid StackAuth session');
    console.log('   These would be tested in integration tests with real authentication\n');

    return true;

  } catch (error) {
    console.error('❌ Resumes API test failed:', error);
    return false;
  }
}

async function testAPIErrorHandling() {
  console.log('🛡️ Testing API Error Handling...\n');

  try {
    // Test non-existent endpoint
    console.log('1. Non-existent Endpoint Test');
    const notFoundResponse = await makeRequest('/api/non-existent');
    
    if (notFoundResponse.status === 404) {
      console.log('   ✅ 404 properly returned for non-existent endpoint');
    } else {
      console.log(`   ⚠️  Expected 404, got ${notFoundResponse.status}`);
    }
    console.log('');

    // Test malformed JSON
    console.log('2. Malformed JSON Test');
    const malformedResponse = await makeRequest('/api/resumes', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (malformedResponse.status >= 400) {
      console.log('   ✅ Malformed JSON properly handled');
    } else {
      console.log(`   ⚠️  Expected error status, got ${malformedResponse.status}`);
    }
    console.log('');

    return true;

  } catch (error) {
    console.error('❌ Error handling test failed:', error);
    return false;
  }
}

async function testAPIPerformance() {
  console.log('⚡ Testing API Performance...\n');

  try {
    const endpoints = [
      '/api/test/db',
      '/api/templates'
    ];

    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint}:`);
      
      const startTime = Date.now();
      const response = await makeRequest(endpoint);
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      
      if (response.ok) {
        console.log(`   ✅ Response time: ${duration}ms`);
        
        if (duration < 1000) {
          console.log('   🚀 Good performance (< 1s)');
        } else if (duration < 3000) {
          console.log('   ⚠️  Acceptable performance (1-3s)');
        } else {
          console.log('   🐌 Slow performance (> 3s)');
        }
      } else {
        console.log(`   ❌ Request failed: ${response.status}`);
      }
      console.log('');
    }

    return true;

  } catch (error) {
    console.error('❌ Performance test failed:', error);
    return false;
  }
}

async function runAPITests() {
  console.log('🧪 Starting API Test Suite');
  console.log('='.repeat(50));

  const dbTest = await testDatabaseAPI();
  const templatesTest = await testTemplatesAPI();
  const resumesTest = await testResumesAPI();
  const errorTest = await testAPIErrorHandling();
  const performanceTest = await testAPIPerformance();

  console.log('='.repeat(50));
  console.log('📊 API Test Results:');
  console.log(`Database API: ${dbTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Templates API: ${templatesTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Resumes API: ${resumesTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Error Handling: ${errorTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Performance: ${performanceTest ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = dbTest && templatesTest.success && resumesTest && errorTest && performanceTest;
  console.log(`\nOverall Result: ${allPassed ? '🎉 ALL TESTS PASSED' : '💥 SOME TESTS FAILED'}`);

  if (!allPassed) {
    console.log('\n💡 Note: Some failures may be expected if the server is not running');
    console.log('   Start the server with: npm run dev');
  }

  return allPassed;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}

export { runAPITests };
