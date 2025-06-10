// Interface matching the editor's Resume interface
interface Resume {
    id: string;
    title: string;
    template: 'modern' | 'professional' | 'creative';
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        linkedin: string;
        summary: string;
    };
    experience: Array<{
        id: string;
        position: string;
        company: string;
        startDate: string;
        endDate?: string;
        current: boolean;
        location: string;
        description: string;
        technologies: string[];
    }>;
    education: Array<{
        id: string;
        degree: string;
        institution: string;
        startDate: string;
        endDate: string;
        location: string;
        gpa?: string;
    }>;
    skills: Array<{
        id: string;
        name: string;
        level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    }>;
    projects: Array<{
        id: string;
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        startDate?: string;
        endDate?: string;
    }>;
    certifications: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
        expiryDate?: string;
        credentialId?: string;
    }>;
    languages: Array<{
        id: string;
        language: string;
        proficiency: 'basic' | 'conversational' | 'professional' | 'native';
    }>;
    awards: Array<{
        id: string;
        title: string;
        issuer: string;
        date?: string;
        description?: string;
    }>;
    customSections: Array<{
        id: string;
        title: string;
        content: string;
        type: 'text' | 'list' | 'table';
        order: number;
    }>;
    settings: {
        fontSize: number;
        fontFamily: string;
        primaryColor: string;
        secondaryColor: string;
        spacing: 'compact' | 'normal' | 'relaxed';
        pageMargins: 'narrow' | 'normal' | 'wide';
    };
    metadata?: {
        atsScore: number;
        lastModified: Date;
        version: number;
        isPublic: boolean;
        tags: string[];
    };
}

export const getSampleResumeData = (): Resume => {
    return {
        id: 'sample-resume',
        title: 'Sample Resume',
        template: 'modern',
        personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            website: 'https://johndoe.dev',
            linkedin: 'https://linkedin.com/in/johndoe',
            summary: 'Experienced software engineer with 5+ years developing scalable web applications. Passionate about creating user-friendly interfaces and solving complex technical challenges. Proven track record of leading cross-functional teams and delivering high-quality products on time.'
        },
        experience: [
            {
                id: 'exp-1',
                position: 'Senior Software Engineer',
                company: 'TechCorp Inc.',
                startDate: '2022-01',
                endDate: '',
                current: true,
                location: 'San Francisco, CA',
                description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored 3 junior developers and conducted technical interviews.',
                technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']
            },
            {
                id: 'exp-2',
                position: 'Full Stack Developer',
                company: 'StartupXYZ',
                startDate: '2020-06',
                endDate: '2021-12',
                current: false,
                location: 'Remote',
                description: 'Built customer-facing web application from scratch using React and Express.js. Integrated payment processing with Stripe API. Optimized database queries resulting in 40% performance improvement.',
                technologies: ['React', 'Express.js', 'MongoDB', 'Stripe', 'Git']
            },
            {
                id: 'exp-3',
                position: 'Junior Developer',
                company: 'WebSolutions Ltd.',
                startDate: '2019-03',
                endDate: '2020-05',
                current: false,
                location: 'New York, NY',
                description: 'Developed responsive websites for small businesses. Collaborated with designers to implement pixel-perfect UI components. Maintained and updated existing client websites.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP']
            }
        ],
        education: [
            {
                id: 'edu-1',
                degree: 'Bachelor of Science in Computer Science',
                institution: 'University of California, Berkeley',
                startDate: '2015-09',
                endDate: '2019-05',
                location: 'Berkeley, CA',
                gpa: '3.8'
            },
            {
                id: 'edu-2',
                degree: 'Full Stack Web Development Bootcamp',
                institution: 'General Assembly',
                startDate: '2018-06',
                endDate: '2018-12',
                location: 'San Francisco, CA',
                gpa: ''
            }
        ],
        skills: [
            { id: 'skill-1', name: 'JavaScript', level: 'expert' },
            { id: 'skill-2', name: 'TypeScript', level: 'advanced' },
            { id: 'skill-3', name: 'React', level: 'expert' },
            { id: 'skill-4', name: 'Node.js', level: 'advanced' },
            { id: 'skill-5', name: 'Python', level: 'intermediate' },
            { id: 'skill-6', name: 'AWS', level: 'intermediate' },
            { id: 'skill-7', name: 'Docker', level: 'intermediate' },
            { id: 'skill-8', name: 'Git', level: 'advanced' },
            { id: 'skill-9', name: 'SQL', level: 'advanced' },
            { id: 'skill-10', name: 'MongoDB', level: 'intermediate' }
        ],
        projects: [
            {
                id: 'proj-1',
                name: 'E-commerce Platform',
                description: 'Full-stack e-commerce application with user authentication, payment processing, and admin dashboard. Built with React, Node.js, and PostgreSQL.',
                technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                url: 'https://github.com/johndoe/ecommerce-platform',
                startDate: '2023-01',
                endDate: '2023-06'
            },
            {
                id: 'proj-2',
                name: 'Task Management App',
                description: 'Collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features.',
                technologies: ['React', 'Socket.io', 'Express.js', 'MongoDB'],
                url: 'https://github.com/johndoe/task-manager',
                startDate: '2022-08',
                endDate: '2022-12'
            },
            {
                id: 'proj-3',
                name: 'Weather Dashboard',
                description: 'Responsive weather application with location-based forecasts, interactive charts, and weather alerts.',
                technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
                url: 'https://github.com/johndoe/weather-dashboard',
                startDate: '2022-03',
                endDate: '2022-05'
            }
        ],
        awards: [
            {
                id: 'ach-1',
                title: 'Employee of the Month',
                issuer: 'TechCorp Inc.',
                description: 'Recognized for outstanding performance and leadership in Q3 2023',
                date: '2023-09'
            },
            {
                id: 'ach-2',
                title: 'Hackathon Winner',
                issuer: 'TechCorp Inc.',
                description: 'First place in company-wide hackathon for innovative AI solution',
                date: '2023-03'
            },
            {
                id: 'ach-3',
                title: 'Open Source Contributor',
                issuer: 'Open Source Community',
                description: 'Contributed to popular React library with 50+ merged PRs',
                date: '2022-12'
            }
        ],
        certifications: [
            {
                id: 'cert-1',
                name: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                date: '2023-06',
                expiryDate: '2026-06',
                credentialId: 'AWS-SA-123456'
            },
            {
                id: 'cert-2',
                name: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                date: '2022-11',
                expiryDate: '2024-11',
                credentialId: 'GCP-PD-789012'
            }
        ],
        languages: [
            { id: 'lang-1', language: 'English', proficiency: 'native' },
            { id: 'lang-2', language: 'Spanish', proficiency: 'conversational' },
            { id: 'lang-3', language: 'French', proficiency: 'basic' }
        ],
        customSections: [
            {
                id: 'custom-1',
                title: 'Volunteer Experience',
                content: 'Code for Good Volunteer - Teaching programming to underserved communities (2020-present)',
                type: 'text' as const,
                order: 1
            },
            {
                id: 'custom-2',
                title: 'Publications',
                content: '"Modern Web Development Practices" - Tech Blog (2023)\n"Scaling React Applications" - Developer Magazine (2022)',
                type: 'text' as const,
                order: 2
            }
        ],
        settings: {
            fontSize: 14,
            fontFamily: 'Inter, system-ui, sans-serif',
            primaryColor: '#2563eb',
            secondaryColor: '#374151',
            spacing: 'normal' as const,
            pageMargins: 'normal' as const
        }
    };
};
