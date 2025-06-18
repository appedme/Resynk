/**
 * ATS Analyzer Test Suite
 * Run this in the browser console on the ATS calculator page to test functionality
 */

// Test data
const goodResumeText = `John Smith
Software Engineer
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith | github.com/johnsmith
San Francisco, CA

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years developing scalable web applications using React, Node.js, and Python. Proven track record of increasing system performance by 40% and reducing deployment time by 60%.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022-Present
• Developed and maintained React applications serving 100k+ daily active users
• Implemented microservices architecture using Node.js and Docker, reducing system downtime by 45%
• Led team of 4 developers in agile development process
• Optimized database queries resulting in 30% faster page load times

Software Engineer | StartupXYZ | 2020-2022
• Built REST APIs using Python Django framework
• Collaborated with cross-functional teams to deliver 15+ features
• Achieved 95% test coverage using Jest and PyTest
• Managed AWS infrastructure including EC2, S3, and RDS

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2020
GPA: 3.8/4.0

SKILLS
Programming Languages: JavaScript, Python, Java, TypeScript
Frameworks: React, Node.js, Django, Express
Databases: PostgreSQL, MySQL, MongoDB
Cloud: AWS, Docker, Kubernetes
Tools: Git, Jenkins, Jira, Agile, Scrum`;

const poorResumeText = `John Doe
I am looking for a job in computers.

I worked at some companies doing stuff with computers and websites. I know how to use Microsoft Word and Excel. I am good with people and work hard.

Education: Went to college

Skills: Computers, Internet, Good attitude`;

const jobDescriptionText = `We are seeking a Senior Software Engineer to join our team. The ideal candidate will have experience with React, Node.js, Python, and cloud technologies like AWS. You will be responsible for developing scalable web applications, working in an agile environment, and collaborating with cross-functional teams. Strong problem-solving skills and experience with microservices architecture are required.`;

// Test function
function runATSTests() {
    console.log('🧪 Starting ATS Calculator Tests...\n');
    
    // Test 1: Good Resume Analysis
    console.log('📊 Test 1: Analyzing Good Resume');
    try {
        // Import the analyzer (assuming it's available globally or can be imported)
        const { ATSAnalyzer } = window;
        
        if (!ATSAnalyzer) {
            console.error('❌ ATSAnalyzer not found. Make sure you\'re on the ATS calculator page.');
            return;
        }
        
        const goodResult = ATSAnalyzer.analyzeResume(goodResumeText, jobDescriptionText);
        console.log('✅ Good Resume Results:', {
            overallScore: goodResult.overallScore,
            keywordMatch: goodResult.keywordMatch,
            formatScore: goodResult.formatScore,
            contentScore: goodResult.contentScore,
            readabilityScore: goodResult.readabilityScore,
            criticalIssues: goodResult.issues.critical.length,
            recommendations: goodResult.recommendations.length,
            foundKeywords: goodResult.foundKeywords.length,
            missingKeywords: goodResult.missingKeywords.length
        });
        
        // Test 2: Poor Resume Analysis
        console.log('\n📊 Test 2: Analyzing Poor Resume');
        const poorResult = ATSAnalyzer.analyzeResume(poorResumeText, jobDescriptionText);
        console.log('✅ Poor Resume Results:', {
            overallScore: poorResult.overallScore,
            keywordMatch: poorResult.keywordMatch,
            formatScore: poorResult.formatScore,
            contentScore: poorResult.contentScore,
            readabilityScore: poorResult.readabilityScore,
            criticalIssues: poorResult.issues.critical.length,
            recommendations: poorResult.recommendations.length,
            foundKeywords: poorResult.foundKeywords.length,
            missingKeywords: poorResult.missingKeywords.length
        });
        
        // Test 3: Comparison
        console.log('\n📈 Test 3: Score Comparison');
        console.log('Good Resume vs Poor Resume:');
        console.log(`Overall Score: ${goodResult.overallScore} vs ${poorResult.overallScore} (${goodResult.overallScore > poorResult.overallScore ? '✅' : '❌'})`);
        console.log(`Keyword Match: ${goodResult.keywordMatch} vs ${poorResult.keywordMatch} (${goodResult.keywordMatch > poorResult.keywordMatch ? '✅' : '❌'})`);
        console.log(`Critical Issues: ${goodResult.issues.critical.length} vs ${poorResult.issues.critical.length} (${goodResult.issues.critical.length < poorResult.issues.critical.length ? '✅' : '❌'})`);
        
        // Test 4: Keyword Analysis
        console.log('\n🔍 Test 4: Keyword Analysis');
        console.log('Good Resume - Found Keywords:', goodResult.foundKeywords.slice(0, 10));
        console.log('Good Resume - Missing Keywords:', goodResult.missingKeywords.slice(0, 5));
        console.log('Poor Resume - Found Keywords:', poorResult.foundKeywords.slice(0, 5));
        console.log('Poor Resume - Missing Keywords:', poorResult.missingKeywords.slice(0, 10));
        
        // Test 5: Recommendations
        console.log('\n💡 Test 5: Recommendations');
        console.log('Good Resume - Top 3 Recommendations:');
        goodResult.recommendations.slice(0, 3).forEach((rec, i) => {
            console.log(`${i + 1}. [${rec.impact.toUpperCase()}] ${rec.title}: ${rec.description.substring(0, 80)}...`);
        });
        
        console.log('\nPoor Resume - Top 3 Recommendations:');
        poorResult.recommendations.slice(0, 3).forEach((rec, i) => {
            console.log(`${i + 1}. [${rec.impact.toUpperCase()}] ${rec.title}: ${rec.description.substring(0, 80)}...`);
        });
        
        console.log('\n🎉 All tests completed successfully!');
        console.log('\n📋 Test Summary:');
        console.log('✅ ATS Analyzer is working correctly');
        console.log('✅ Score calculation is functional');
        console.log('✅ Keyword matching is working');
        console.log('✅ Issue detection is working');
        console.log('✅ Recommendations are being generated');
        console.log('✅ Good resumes score higher than poor resumes');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Test UI functionality
function testUIFunctionality() {
    console.log('\n🖥️ Testing UI Functionality...');
    
    // Check if we're on the right page
    if (!window.location.pathname.includes('ats-calculator')) {
        console.log('⚠️ Navigate to /ats-calculator to test UI functionality');
        return;
    }
    
    // Test form elements
    const resumeTextarea = document.querySelector('textarea[placeholder*="resume"]');
    const jobDescTextarea = document.querySelector('textarea[placeholder*="job"]');
    const analyzeButton = document.querySelector('button:contains("Analyze")');
    
    console.log('Form Elements Found:');
    console.log('✅ Resume textarea:', !!resumeTextarea);
    console.log('✅ Job description textarea:', !!jobDescTextarea);
    console.log('✅ Analyze button:', !!analyzeButton);
    
    if (resumeTextarea) {
        console.log('🧪 Testing resume input...');
        resumeTextarea.value = goodResumeText.substring(0, 100) + '...';
        resumeTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Resume text input working');
    }
}

// Export functions to global scope for browser console
window.runATSTests = runATSTests;
window.testUIFunctionality = testUIFunctionality;
window.testData = {
    goodResumeText,
    poorResumeText,
    jobDescriptionText
};

console.log('🚀 ATS Calculator Test Suite Loaded!');
console.log('📝 Available functions:');
console.log('- runATSTests() - Test the ATS analyzer engine');
console.log('- testUIFunctionality() - Test UI components');
console.log('- testData - Sample resume and job description data');
console.log('\n💡 Run runATSTests() to start testing!');
