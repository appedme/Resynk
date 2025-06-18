import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

// PDF styles
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 30,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    header: {
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#000000',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2563eb',
    },
    contactInfo: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    contactItem: {
        fontSize: 10,
        marginRight: 15,
        marginBottom: 3,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1f2937',
        borderBottom: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 3,
    },
    text: {
        fontSize: 11,
        marginBottom: 3,
        textAlign: 'justify',
    },
    experienceItem: {
        marginBottom: 12,
    },
    jobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    company: {
        fontSize: 11,
        color: '#2563eb',
        marginBottom: 2,
    },
    duration: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 3,
    },
    location: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 5,
    },
    description: {
        fontSize: 10,
        textAlign: 'justify',
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 10,
    },
    degree: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    institution: {
        fontSize: 11,
        color: '#2563eb',
        marginBottom: 2,
    },
    gpa: {
        fontSize: 10,
        color: '#6b7280',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skill: {
        fontSize: 10,
        marginRight: 8,
        marginBottom: 3,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: '#f3f4f6',
        borderRadius: 3,
    },
    summary: {
        fontSize: 11,
        textAlign: 'justify',
        lineHeight: 1.4,
        marginBottom: 3,
    },
});

// Server-side PDF document creation using React.createElement
function createPDFDocument(resume: ResumeData) {
    // Create contact info items
    const contactItems = [
        React.createElement(Text, { key: 'email', style: styles.contactItem }, `📧 ${resume.personal.email}`),
    ];

    if (resume.personal.phone) {
        contactItems.push(
            React.createElement(Text, { key: 'phone', style: styles.contactItem }, `📞 ${resume.personal.phone}`)
        );
    }

    if (resume.personal.location) {
        contactItems.push(
            React.createElement(Text, { key: 'location', style: styles.contactItem }, `📍 ${resume.personal.location}`)
        );
    }

    if (resume.personal.website) {
        contactItems.push(
            React.createElement(Text, { key: 'website', style: styles.contactItem }, `🌐 ${resume.personal.website}`)
        );
    }

    if (resume.personal.linkedin) {
        contactItems.push(
            React.createElement(Text, { key: 'linkedin', style: styles.contactItem }, `💼 ${resume.personal.linkedin}`)
        );
    }

    // Create sections array
    const sections = [];

    // Header
    const header = React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.name }, resume.personal.full_name),
        React.createElement(View, { style: styles.contactInfo }, ...contactItems)
    );

    // Summary section
    if (resume.summary) {
        sections.push(
            React.createElement(
                View,
                { key: 'summary', style: styles.section },
                React.createElement(Text, { style: styles.sectionTitle }, 'SUMMARY'),
                React.createElement(Text, { style: styles.summary }, resume.summary)
            )
        );
    }

    // Experience section
    if (resume.experience && resume.experience.length > 0) {
        const experienceItems = resume.experience.map((exp, index) => {
            const experienceElements = [
                React.createElement(Text, { key: 'title', style: styles.jobTitle }, exp.position),
                React.createElement(Text, { key: 'company', style: styles.company }, exp.company),
                React.createElement(
                    Text,
                    { key: 'duration', style: styles.duration },
                    `${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'Present'}`
                ),
            ];

            if (exp.location) {
                experienceElements.push(
                    React.createElement(Text, { key: 'location', style: styles.location }, exp.location)
                );
            }

            experienceElements.push(
                React.createElement(Text, { key: 'description', style: styles.description }, exp.description)
            );

            return React.createElement(
                View,
                { key: index, style: styles.experienceItem },
                ...experienceElements
            );
        });

        sections.push(
            React.createElement(
                View,
                { key: 'experience', style: styles.section },
                React.createElement(Text, { style: styles.sectionTitle }, 'EXPERIENCE'),
                ...experienceItems
            )
        );
    }

    // Education section
    if (resume.education && resume.education.length > 0) {
        const educationItems = resume.education.map((edu, index) => {
            const educationElements = [
                React.createElement(Text, { key: 'degree', style: styles.degree }, edu.degree),
                React.createElement(Text, { key: 'institution', style: styles.institution }, edu.institution),
                React.createElement(
                    Text,
                    { key: 'duration', style: styles.duration },
                    `${edu.start_date} - ${edu.end_date || 'Present'}`
                ),
            ];

            if (edu.gpa) {
                educationElements.push(
                    React.createElement(Text, { key: 'gpa', style: styles.gpa }, `GPA: ${edu.gpa}`)
                );
            }

            return React.createElement(
                View,
                { key: index, style: styles.educationItem },
                ...educationElements
            );
        });

        sections.push(
            React.createElement(
                View,
                { key: 'education', style: styles.section },
                React.createElement(Text, { style: styles.sectionTitle }, 'EDUCATION'),
                ...educationItems
            )
        );
    }

    // Skills section
    if (resume.skills && resume.skills.length > 0) {
        const skillItems = resume.skills.map((skill, index) =>
            React.createElement(Text, { key: index, style: styles.skill }, skill.name)
        );

        sections.push(
            React.createElement(
                View,
                { key: 'skills', style: styles.section },
                React.createElement(Text, { style: styles.sectionTitle }, 'SKILLS'),
                React.createElement(View, { style: styles.skillsContainer }, ...skillItems)
            )
        );
    }

    // Create the page
    const page = React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        header,
        ...sections
    );

    // Create the document
    return React.createElement(Document, {}, page);
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const resumeData: ResumeData = await request.json();

        // Validate required data
        if (!resumeData.personal?.full_name || !resumeData.personal?.email) {
            return NextResponse.json(
                { error: 'Missing required personal information' },
                { status: 400 }
            );
        }

        console.log('Generating PDF for:', resumeData.personal.full_name);

        // Create the PDF document
        const doc = createPDFDocument(resumeData);
        
        // Generate PDF as buffer
        const pdfInstance = pdf(doc);
        const pdfBlob = await pdfInstance.toBlob();
        
        // Convert blob to array buffer then to Buffer
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        // Return PDF as response
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${resumeData.personal.full_name.replace(/\s+/g, '_')}_Resume.pdf"`,
            },
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        
        return NextResponse.json(
            { 
                error: 'Failed to generate PDF',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
