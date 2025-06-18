/**
 * ATS (Applicant Tracking System) Analysis Utilities
 * Provides comprehensive resume analysis for ATS compatibility
 */

export interface ATSAnalysisResult {
  overallScore: number;
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
  readabilityScore: number;
  sectionScores: {
    contact: number;
    experience: number;
    education: number;
    skills: number;
  };
  issues: {
    critical: string[];
    warnings: string[];
    suggestions: string[];
  };
  missingKeywords: string[];
  foundKeywords: string[];
  recommendations: ATSRecommendation[];
  metrics: {
    wordCount: number;
    sectionCount: number;
    quantifiableAchievements: number;
    actionVerbsUsed: number;
  };
}

export interface ATSRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  category: 'format' | 'content' | 'keywords' | 'structure' | 'optimization';
  section?: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';
  priority: number;
}

// Common ATS-friendly keywords by category
export const ATS_KEYWORDS = {
  technical: [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 'SQL', 'AWS', 'Git',
    'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'TypeScript',
    'Angular', 'Vue.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'PHP',
    'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'Artificial Intelligence',
    'Azure', 'Google Cloud', 'Jenkins', 'CircleCI', 'Terraform', 'Ansible'
  ],
  soft: [
    'Leadership', 'Communication', 'Project Management', 'Team Collaboration', 'Problem Solving',
    'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Analytical',
    'Strategic Planning', 'Decision Making', 'Conflict Resolution', 'Mentoring', 'Training',
    'Public Speaking', 'Negotiation', 'Customer Service', 'Interpersonal Skills', 'Multitasking'
  ],
  business: [
    'Strategic Planning', 'Budget Management', 'Stakeholder Management', 'Process Improvement',
    'Data Analysis', 'Marketing', 'Sales', 'Customer Service', 'Quality Assurance',
    'Business Development', 'Market Research', 'Financial Analysis', 'Risk Management',
    'Vendor Management', 'Contract Negotiation', 'Performance Management', 'Change Management',
    'Compliance', 'Audit', 'Reporting', 'KPI', 'ROI', 'P&L', 'Budget Planning'
  ],
  certifications: [
    'AWS Certified', 'Google Cloud Certified', 'Microsoft Certified', 'Cisco Certified',
    'CompTIA', 'CISSP', 'CISM', 'PMP', 'Agile', 'Scrum Master', 'Six Sigma',
    'ITIL', 'Salesforce Certified', 'Oracle Certified', 'Red Hat Certified'
  ]
};

// Action verbs that ATS systems and recruiters look for
export const ACTION_VERBS = [
  'Achieved', 'Accelerated', 'Accomplished', 'Analyzed', 'Built', 'Created', 'Delivered',
  'Developed', 'Designed', 'Enhanced', 'Established', 'Executed', 'Generated', 'Implemented',
  'Improved', 'Increased', 'Initiated', 'Launched', 'Led', 'Managed', 'Optimized',
  'Organized', 'Reduced', 'Resolved', 'Streamlined', 'Strengthened', 'Supervised',
  'Transformed', 'Utilized', 'Spearheaded', 'Coordinated', 'Facilitated', 'Collaborated'
];

// Words that should be avoided or used sparingly
export const WEAK_WORDS = [
  'Responsible for', 'Duties included', 'Worked on', 'Helped with', 'Assisted',
  'Participated', 'Involved', 'Familiar with', 'Knowledge of', 'Experience with'
];

export class ATSAnalyzer {
  /**
   * Main analysis function that evaluates a resume's ATS compatibility
   */
  static analyzeResume(
    resumeText: string, 
    jobDescription?: string,
    targetRole?: string
  ): ATSAnalysisResult {
    const normalizedResume = this.normalizeText(resumeText);
    const targetKeywords = this.extractTargetKeywords(jobDescription, targetRole);
    
    // Calculate individual scores
    const keywordMatch = this.calculateKeywordScore(normalizedResume, targetKeywords);
    const formatScore = this.calculateFormatScore(resumeText);
    const contentScore = this.calculateContentScore(normalizedResume);
    const readabilityScore = this.calculateReadabilityScore(resumeText);
    const sectionScores = this.calculateSectionScores(normalizedResume);
    
    // Calculate overall score with weighted components
    const overallScore = Math.round(
      keywordMatch * 0.35 +
      formatScore * 0.25 +
      contentScore * 0.25 +
      readabilityScore * 0.15
    );

    // Analyze keywords
    const { foundKeywords, missingKeywords } = this.analyzeKeywords(normalizedResume, targetKeywords);
    
    // Generate issues and recommendations
    const issues = this.identifyIssues(resumeText, normalizedResume, {
      overallScore,
      keywordMatch,
      formatScore,
      contentScore,
      readabilityScore
    });

    // Calculate metrics
    const metrics = this.calculateMetrics(normalizedResume);

    // Build partial analysis result for recommendations
    const partialAnalysis: ATSAnalysisResult = {
      overallScore,
      keywordMatch: Math.round(keywordMatch),
      formatScore: Math.round(formatScore),
      contentScore: Math.round(contentScore),
      readabilityScore: Math.round(readabilityScore),
      sectionScores,
      issues,
      missingKeywords: missingKeywords.slice(0, 15),
      foundKeywords: foundKeywords.slice(0, 20),
      recommendations: [], // Will be populated below
      metrics
    };
    
    const recommendations = this.generateRecommendations(resumeText, normalizedResume, partialAnalysis);

    return {
      overallScore,
      keywordMatch: Math.round(keywordMatch),
      formatScore: Math.round(formatScore),
      contentScore: Math.round(contentScore),
      readabilityScore: Math.round(readabilityScore),
      sectionScores,
      issues,
      missingKeywords: missingKeywords.slice(0, 15),
      foundKeywords: foundKeywords.slice(0, 20),
      recommendations: recommendations.sort((a, b) => b.priority - a.priority),
      metrics
    };
  }

  /**
   * Normalize text for consistent analysis
   */
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s@.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract target keywords from job description or use defaults
   */
  private static extractTargetKeywords(jobDescription?: string, targetRole?: string): string[] {
    const keywords = new Set<string>();

    // Add default keywords based on target role
    if (targetRole) {
      const roleKeywords = this.getKeywordsByRole(targetRole);
      roleKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()));
    }

    // Extract keywords from job description
    if (jobDescription) {
      const extractedKeywords = this.extractKeywordsFromText(jobDescription);
      extractedKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()));
    }

    // If no specific keywords, use a general set
    if (keywords.size === 0) {
      const generalKeywords = [
        ...ATS_KEYWORDS.technical.slice(0, 10),
        ...ATS_KEYWORDS.soft.slice(0, 10),
        ...ATS_KEYWORDS.business.slice(0, 10)
      ];
      generalKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()));
    }

    return Array.from(keywords);
  }

  /**
   * Get keywords specific to a role
   */
  private static getKeywordsByRole(role: string): string[] {
    const roleMap: Record<string, string[]> = {
      'software engineer': [...ATS_KEYWORDS.technical, 'Agile', 'Scrum', 'CI/CD'],
      'data scientist': ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
      'product manager': ['Product Management', 'Roadmap', 'Stakeholder Management', 'Analytics'],
      'marketing': ['Digital Marketing', 'SEO', 'SEM', 'Analytics', 'Campaign Management'],
      'sales': ['Sales', 'CRM', 'Lead Generation', 'Pipeline Management', 'Negotiation']
    };

    const normalizedRole = role.toLowerCase();
    return roleMap[normalizedRole] || ATS_KEYWORDS.technical.slice(0, 15);
  }

  /**
   * Extract meaningful keywords from text
   */
  private static extractKeywordsFromText(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const keywords = new Set<string>();
    const skillPattern = /\b(?:experience|proficient|skilled|knowledge|familiar)(?:\s+(?:in|with))?\s+([^.]+)/gi;
    
    // Extract skills mentioned in context
    let match;
    while ((match = skillPattern.exec(text)) !== null) {
      const skills = match[1].split(/[,&\s]+/).filter(skill => skill.length > 2);
      skills.forEach(skill => keywords.add(skill.trim()));
    }

    // Extract technical terms (capitalized words, technologies)
    words.forEach(word => {
      if (word.length > 2 && !this.isCommonWord(word)) {
        if (this.isTechnicalTerm(word) || word.includes('.') || word.includes('+')) {
          keywords.add(word);
        }
      }
    });

    return Array.from(keywords).slice(0, 25);
  }

  /**
   * Check if a word is a common English word
   */
  private static isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was',
      'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now',
      'old', 'see', 'two', 'way', 'who', 'its', 'said', 'each', 'make', 'most', 'over',
      'such', 'time', 'very', 'when', 'much', 'then', 'them', 'these', 'they', 'were',
      'will', 'your', 'from', 'have', 'more', 'been', 'into', 'like', 'than', 'find',
      'come', 'made', 'many', 'oil', 'sit', 'use', 'her', 'would', 'which', 'their'
    ]);
    return commonWords.has(word.toLowerCase());
  }

  /**
   * Check if a word is likely a technical term
   */
  private static isTechnicalTerm(word: string): boolean {
    return (
      word.length > 3 &&
      (word.includes('js') || 
       word.includes('sql') || 
       word.includes('api') ||
       word.includes('aws') ||
       word.includes('css') ||
       word.includes('html') ||
       /\d/.test(word) || // Contains numbers
       word === word.toUpperCase()) // All caps (likely acronym)
    );
  }

  /**
   * Calculate keyword matching score
   */
  private static calculateKeywordScore(resumeText: string, targetKeywords: string[]): number {
    if (targetKeywords.length === 0) return 80; // Default score if no target keywords

    const foundCount = targetKeywords.filter(keyword => 
      resumeText.includes(keyword.toLowerCase())
    ).length;

    return Math.min((foundCount / targetKeywords.length) * 100, 100);
  }

  /**
   * Calculate format compatibility score
   */
  private static calculateFormatScore(resumeText: string): number {
    let score = 100;
    
    // Check for formatting issues that ATS systems struggle with
    if (resumeText.includes('\t')) score -= 10; // Tabs
    if (resumeText.includes('•') && resumeText.split('•').length > 20) score -= 5; // Too many bullets
    if (!/email|@[\w.-]+\.[a-z]{2,}/i.test(resumeText)) score -= 20; // Missing email
    if (!/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(resumeText)) score -= 15; // Missing phone
    
    // Check for problematic characters
    const problematicChars = ['|', '□', '▪', '◆', '★'];
    problematicChars.forEach(char => {
      if (resumeText.includes(char)) score -= 5;
    });

    // Check resume length
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) score -= 25; // Too short
    if (wordCount > 1000) score -= 10; // Too long

    return Math.max(score, 0);
  }

  /**
   * Calculate content quality score
   */
  private static calculateContentScore(resumeText: string): number {
    let score = 40; // Base score

    // Check for important sections
    const sections = {
      contact: /contact|email|phone/i,
      summary: /summary|objective|profile/i,
      experience: /experience|work|employment|career/i,
      education: /education|degree|university|college|school/i,
      skills: /skills|technical|proficient|competenc/i
    };

    Object.values(sections).forEach(pattern => {
      if (pattern.test(resumeText)) score += 8;
    });

    // Check for quantifiable achievements
    const quantifiablePattern = /\d+(?:%|\+|k|million|billion|\$|years?|months?)/gi;
    const quantifiableMatches = resumeText.match(quantifiablePattern);
    if (quantifiableMatches) {
      score += Math.min(quantifiableMatches.length * 3, 15);
    }

    // Check for action verbs
    const actionVerbPattern = new RegExp(`\\b(${ACTION_VERBS.join('|').toLowerCase()})\\b`, 'gi');
    const actionVerbMatches = resumeText.match(actionVerbPattern);
    if (actionVerbMatches) {
      score += Math.min(actionVerbMatches.length * 2, 10);
    }

    // Penalize weak language
    const weakWordPattern = new RegExp(`\\b(${WEAK_WORDS.join('|').toLowerCase()})\\b`, 'gi');
    const weakWordMatches = resumeText.match(weakWordPattern);
    if (weakWordMatches) {
      score -= Math.min(weakWordMatches.length * 2, 15);
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Calculate readability score
   */
  private static calculateReadabilityScore(resumeText: string): number {
    const words = resumeText.split(/\s+/).length;
    const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;

    let score = 80; // Base score

    // Optimal range is 15-20 words per sentence
    if (avgWordsPerSentence > 25) score -= 20; // Too complex
    if (avgWordsPerSentence < 8) score -= 15; // Too choppy
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) score += 10; // Optimal

    // Check for overly long paragraphs
    const paragraphs = resumeText.split(/\n\s*\n/);
    const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100);
    if (longParagraphs.length > 0) score -= 10;

    return Math.max(score, 0);
  }

  /**
   * Calculate scores for individual sections
   */
  private static calculateSectionScores(resumeText: string): {
    contact: number;
    experience: number;
    education: number;
    skills: number;
  } {
    return {
      contact: this.evaluateContactSection(resumeText),
      experience: this.evaluateExperienceSection(resumeText),
      education: this.evaluateEducationSection(resumeText),
      skills: this.evaluateSkillsSection(resumeText)
    };
  }

  private static evaluateContactSection(text: string): number {
    let score = 0;
    if (/@[\w.-]+\.[a-z]{2,}/i.test(text)) score += 30; // Email
    if (/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(text)) score += 25; // Phone
    if (/linkedin/i.test(text)) score += 20; // LinkedIn
    if (/github|portfolio|website/i.test(text)) score += 15; // Portfolio/Website
    if (/[a-z\s]+,\s*[a-z]{2}/i.test(text)) score += 10; // Location
    return score;
  }

  private static evaluateExperienceSection(text: string): number {
    let score = 0;
    if (/\d{4}[-–]\d{4}|\d{4}[-–]present/i.test(text)) score += 25; // Date ranges
    if (/company|corporation|inc\.|llc/i.test(text)) score += 20; // Company names
    const actionVerbs = text.match(new RegExp(`\\b(${ACTION_VERBS.join('|').toLowerCase()})\\b`, 'gi'));
    if (actionVerbs && actionVerbs.length > 3) score += 25; // Action verbs
    const metrics = text.match(/\d+(?:%|\+|k|million|billion|\$)/gi);
    if (metrics && metrics.length > 2) score += 30; // Quantifiable results
    return Math.min(score, 100);
  }

  private static evaluateEducationSection(text: string): number {
    let score = 0;
    if (/bachelor|master|phd|doctorate/i.test(text)) score += 40; // Degree
    if (/university|college|institute/i.test(text)) score += 30; // Institution
    if (/\d{4}|\d{2}\/\d{4}/g.test(text)) score += 20; // Graduation date
    if (/gpa|grade/i.test(text)) score += 10; // GPA mentioned
    return Math.min(score, 100);
  }

  private static evaluateSkillsSection(text: string): number {
    let score = 0;
    const technicalSkills = text.match(new RegExp(`\\b(${ATS_KEYWORDS.technical.join('|').toLowerCase()})\\b`, 'gi'));
    if (technicalSkills && technicalSkills.length > 5) score += 40;
    
    const softSkills = text.match(new RegExp(`\\b(${ATS_KEYWORDS.soft.join('|').toLowerCase()})\\b`, 'gi'));
    if (softSkills && softSkills.length > 3) score += 30;
    
    const certifications = text.match(/certified|certification|license/gi);
    if (certifications && certifications.length > 0) score += 30;
    
    return Math.min(score, 100);
  }

  /**
   * Analyze which keywords are found vs missing
   */
  private static analyzeKeywords(resumeText: string, targetKeywords: string[]): {
    foundKeywords: string[];
    missingKeywords: string[];
  } {
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    targetKeywords.forEach(keyword => {
      if (resumeText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    return { foundKeywords, missingKeywords };
  }

  /**
   * Identify specific issues with the resume
   */
  private static identifyIssues(
    originalText: string,
    normalizedText: string,
    scores: {
      overallScore: number;
      keywordMatch: number;
      formatScore: number;
      contentScore: number;
      readabilityScore: number;
    }
  ): { critical: string[]; warnings: string[]; suggestions: string[] } {
    const critical: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Critical issues
    if (scores.overallScore < 50) {
      critical.push('Resume has very low ATS compatibility - major improvements needed');
    }
    if (!/@[\w.-]+\.[a-z]{2,}/i.test(originalText)) {
      critical.push('Missing email address - ATS systems require contact information');
    }
    if (scores.keywordMatch < 20) {
      critical.push('Extremely low keyword match - resume may be filtered out automatically');
    }

    // Warnings
    if (!/-?\d{3}-?\d{3}-?\d{4}/.test(originalText)) {
      warnings.push('Missing phone number in contact information');
    }
    if (scores.formatScore < 70) {
      warnings.push('Formatting issues detected that may cause ATS parsing problems');
    }
    if (originalText.split(/\s+/).length > 800) {
      warnings.push('Resume may be too long - consider condensing to 1-2 pages');
    }
    if (!/-linkedin/i.test(normalizedText)) {
      warnings.push('Consider adding LinkedIn profile URL');
    }

    // Suggestions
    if (scores.keywordMatch < 60) {
      suggestions.push('Increase keyword density by incorporating more relevant terms');
    }
    if (scores.contentScore < 70) {
      suggestions.push('Add more quantifiable achievements and action verbs');
    }
    if (!/portfolio|github|website/i.test(normalizedText)) {
      suggestions.push('Consider adding portfolio or GitHub URL to showcase work');
    }

    return { critical, warnings, suggestions };
  }

  /**
   * Generate specific recommendations for improvement
   */
  private static generateRecommendations(
    originalText: string,
    normalizedText: string,
    analysis: ATSAnalysisResult
  ): ATSRecommendation[] {
    const recommendations: ATSRecommendation[] = [];
    let idCounter = 1;

    // High-priority recommendations
    if (analysis.keywordMatch < 50) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: 'Optimize Keyword Usage',
        description: 'Add more relevant keywords throughout your resume, especially in the skills and experience sections. Focus on technical skills, tools, and methodologies mentioned in job postings.',
        impact: 'critical',
        category: 'keywords',
        section: 'skills',
        priority: 100
      });
    }

    if (analysis.formatScore < 70) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: 'Improve ATS-Friendly Formatting',
        description: 'Use standard fonts, clear section headers, and avoid complex formatting. Stick to simple bullet points and standard section names like "Experience" and "Education".',
        impact: 'high',
        category: 'format',
        priority: 90
      });
    }

    if (analysis.contentScore < 60) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: 'Enhance Achievement Statements',
        description: 'Start bullet points with strong action verbs and include specific metrics. Instead of "Responsible for sales," write "Increased sales by 25% over 6 months."',
        impact: 'high',
        category: 'content',
        section: 'experience',
        priority: 85
      });
    }

    // Add more specific recommendations based on missing elements
    if (analysis.sectionScores.contact < 80) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: 'Complete Contact Information',
        description: 'Ensure your resume includes email, phone number, LinkedIn profile, and location. This information should be clearly visible at the top.',
        impact: 'high',
        category: 'structure',
        section: 'contact',
        priority: 95
      });
    }

    // Medium priority recommendations
    if (!normalizedText.includes('summary') && !normalizedText.includes('objective')) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: 'Add Professional Summary',
        description: 'Include a 2-3 sentence professional summary that highlights your key qualifications and career goals.',
        impact: 'medium',
        category: 'content',
        section: 'summary',
        priority: 70
      });
    }

    return recommendations;
  }

  /**
   * Calculate various metrics about the resume
   */
  private static calculateMetrics(resumeText: string): {
    wordCount: number;
    sectionCount: number;
    quantifiableAchievements: number;
    actionVerbsUsed: number;
  } {
    const wordCount = resumeText.split(/\s+/).length;
    
    const sectionHeaders = resumeText.match(/\b(experience|education|skills|summary|objective|projects|certifications|awards)\b/gi);
    const sectionCount = sectionHeaders ? new Set(sectionHeaders.map(s => s.toLowerCase())).size : 0;
    
    const quantifiablePattern = /\d+(?:%|\+|k|million|billion|\$|years?|months?)/gi;
    const quantifiableMatches = resumeText.match(quantifiablePattern);
    const quantifiableAchievements = quantifiableMatches ? quantifiableMatches.length : 0;
    
    const actionVerbPattern = new RegExp(`\\b(${ACTION_VERBS.join('|').toLowerCase()})\\b`, 'gi');
    const actionVerbMatches = resumeText.match(actionVerbPattern);
    const actionVerbsUsed = actionVerbMatches ? new Set(actionVerbMatches.map(v => v.toLowerCase())).size : 0;

    return {
      wordCount,
      sectionCount,
      quantifiableAchievements,
      actionVerbsUsed
    };
  }
}
