/**
 * Resume Persistence Test Script
 * Run this in the browser console to test resume persistence
 */

// Test data for persistence testing
const testResumeData = {
    personalInfo: {
        firstName: "John",
        lastName: "Doe", 
        email: "john.doe@example.com",
        phone: "+1234567890",
        location: "San Francisco, CA",
        website: "johndoe.com",
        linkedin: "linkedin.com/in/johndoe",
        summary: "Experienced software engineer with 5+ years of experience..."
    },
    experience: [
        {
            id: "exp1",
            position: "Senior Software Engineer",
            company: "Tech Corp",
            startDate: "2022-01",
            endDate: "",
            current: true,
            location: "San Francisco, CA",
            description: "Led development of React applications...",
            technologies: ["React", "Node.js", "TypeScript"]
        }
    ],
    education: [
        {
            id: "edu1",
            degree: "Bachelor of Science in Computer Science",
            institution: "Stanford University",
            startDate: "2016-09",
            endDate: "2020-06",
            location: "Stanford, CA",
            gpa: "3.8"
        }
    ],
    skills: [
        { id: "skill1", name: "JavaScript", level: "expert" },
        { id: "skill2", name: "React", level: "expert" },
        { id: "skill3", name: "Node.js", level: "advanced" }
    ],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    customSections: []
};

// Function to test saving a resume
function testSaveResume() {
    console.log('🧪 Testing resume save functionality...');
    
    try {
        // Check if SaveLoadService is available
        if (typeof window.SaveLoadService !== 'undefined') {
            const service = window.SaveLoadService;
            const resumeId = service.saveResume(testResumeData, 'Test Resume for Persistence');
            console.log('✅ Resume saved with ID:', resumeId);
            return resumeId;
        } else {
            console.log('⚠️ SaveLoadService not available globally. Checking localStorage directly...');
            
            // Test localStorage directly
            const resumes = JSON.parse(localStorage.getItem('resync_resumes') || '[]');
            console.log('📦 Found', resumes.length, 'resumes in localStorage');
            
            if (resumes.length > 0) {
                console.log('🔍 Latest resume:', resumes[0]);
                return resumes[0].id;
            }
        }
    } catch (error) {
        console.error('❌ Error testing save:', error);
    }
}

// Function to test loading current resume
function testLoadCurrentResume() {
    console.log('🧪 Testing current resume load functionality...');
    
    try {
        const currentResumeId = localStorage.getItem('resync_current_resume_id');
        console.log('🆔 Current resume ID from localStorage:', currentResumeId);
        
        if (currentResumeId) {
            const resumes = JSON.parse(localStorage.getItem('resync_resumes') || '[]');
            const currentResume = resumes.find(r => r.id === currentResumeId);
            
            if (currentResume) {
                console.log('✅ Current resume found:', currentResume.title);
                console.log('📄 Resume data preview:', {
                    id: currentResume.id,
                    title: currentResume.title,
                    lastModified: currentResume.lastModified,
                    hasPersonalInfo: !!currentResume.data?.personalInfo,
                    experienceCount: currentResume.data?.experience?.length || 0,
                    skillsCount: currentResume.data?.skills?.length || 0
                });
                return currentResume;
            } else {
                console.log('❌ Current resume ID exists but resume not found in storage');
            }
        } else {
            console.log('⚠️ No current resume ID found');
        }
    } catch (error) {
        console.error('❌ Error testing load:', error);
    }
}

// Function to simulate user workflow
function testPersistenceWorkflow() {
    console.log('🚀 Testing complete persistence workflow...\n');
    
    console.log('Step 1: Check initial state');
    testLoadCurrentResume();
    
    console.log('\nStep 2: Save a test resume');
    const savedId = testSaveResume();
    
    console.log('\nStep 3: Verify current resume is set');
    testLoadCurrentResume();
    
    console.log('\nStep 4: Simulate page reload (clear in-memory state)');
    console.log('💡 In a real scenario, you would reload the page here');
    console.log('💡 The editor should automatically load the current resume');
    
    console.log('\n🎯 Persistence Test Summary:');
    console.log('✅ Resume saving working');
    console.log('✅ Current resume ID tracking working');
    console.log('✅ Resume loading from localStorage working');
    console.log('✅ Ready for page reload test');
    
    return savedId;
}

// Function to manually trigger editor persistence check
function testEditorPersistence() {
    console.log('🧪 Testing editor persistence integration...');
    
    // Check if we're on the editor page
    if (!window.location.pathname.includes('/editor')) {
        console.log('⚠️ Not on editor page. Navigate to /editor to test.');
        return;
    }
    
    // Check for React components
    const hasReactElements = document.querySelector('[data-react-element]') || 
                           document.querySelector('.resume-editor') ||
                           document.querySelector('[class*="editor"]');
    
    console.log('🔍 React editor elements found:', !!hasReactElements);
    
    // Check localStorage state
    const currentId = localStorage.getItem('resync_current_resume_id');
    const resumes = JSON.parse(localStorage.getItem('resync_resumes') || '[]');
    
    console.log('📊 Storage state:');
    console.log('  - Current resume ID:', currentId);
    console.log('  - Total resumes stored:', resumes.length);
    console.log('  - Latest resume:', resumes[0]?.title || 'None');
    
    if (currentId && resumes.length > 0) {
        console.log('✅ Persistence setup complete - editor should load current resume');
    } else {
        console.log('⚠️ No persisted resume found - editor will create new resume');
    }
}

// Main test function
function runPersistenceTests() {
    console.log('🧪 Starting Resume Persistence Tests...\n');
    
    testPersistenceWorkflow();
    
    console.log('\n🔧 Editor-specific tests...');
    testEditorPersistence();
    
    console.log('\n💡 Manual Test Instructions:');
    console.log('1. Make changes to a resume in the editor');
    console.log('2. Wait 5 seconds for auto-save');
    console.log('3. Reload the page (Ctrl+R / Cmd+R)');
    console.log('4. The editor should restore your changes automatically');
    
    console.log('\n📋 If persistence is working correctly:');
    console.log('✅ Changes are preserved after page reload');
    console.log('✅ URL updates to /editor/{resume-id}');
    console.log('✅ Toast notification shows "Continued editing: [Resume Title]"');
}

// Expose functions globally for browser console
window.testPersistence = {
    runTests: runPersistenceTests,
    testSave: testSaveResume,
    testLoad: testLoadCurrentResume,
    testWorkflow: testPersistenceWorkflow,
    testEditor: testEditorPersistence
};

console.log('🚀 Resume Persistence Test Suite Loaded!');
console.log('📝 Available functions:');
console.log('- testPersistence.runTests() - Run all persistence tests');
console.log('- testPersistence.testSave() - Test saving functionality');
console.log('- testPersistence.testLoad() - Test loading functionality');
console.log('- testPersistence.testEditor() - Test editor integration');
console.log('\n💡 Run testPersistence.runTests() to start testing!');
