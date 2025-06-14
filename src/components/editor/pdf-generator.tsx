"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

// Register a font (optional - you can use built-in fonts)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
// });

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

interface PDFDocumentProps {
    resume: ResumeData;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ resume }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{resume.personal.full_name}</Text>
                <View style={styles.contactInfo}>
                    <Text style={styles.contactItem}>📧 {resume.personal.email}</Text>
                    {resume.personal.phone && (
                        <Text style={styles.contactItem}>📞 {resume.personal.phone}</Text>
                    )}
                    {resume.personal.location && (
                        <Text style={styles.contactItem}>📍 {resume.personal.location}</Text>
                    )}
                    {resume.personal.website && (
                        <Text style={styles.contactItem}>🌐 {resume.personal.website}</Text>
                    )}
                    {resume.personal.linkedin && (
                        <Text style={styles.contactItem}>💼 {resume.personal.linkedin}</Text>
                    )}
                </View>
            </View>

            {/* Summary */}
            {resume.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SUMMARY</Text>
                    <Text style={styles.summary}>{resume.summary}</Text>
                </View>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                    {resume.experience.map((exp, index) => (
                        <View key={index} style={styles.experienceItem}>
                            <Text style={styles.jobTitle}>{exp.position}</Text>
                            <Text style={styles.company}>{exp.company}</Text>
                            <Text style={styles.duration}>
                                {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date || 'Present'}
                            </Text>
                            {exp.location && (
                                <Text style={styles.location}>{exp.location}</Text>
                            )}
                            <Text style={styles.description}>{exp.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                    {resume.education.map((edu, index) => (
                        <View key={index} style={styles.educationItem}>
                            <Text style={styles.degree}>{edu.degree}</Text>
                            <Text style={styles.institution}>{edu.institution}</Text>
                            <Text style={styles.duration}>
                                {edu.start_date} - {edu.end_date || 'Present'}
                            </Text>
                            {edu.gpa && (
                                <Text style={styles.gpa}>GPA: {edu.gpa}</Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SKILLS</Text>
                    <View style={styles.skillsContainer}>
                        {resume.skills.map((skill, index) => (
                            <Text key={index} style={styles.skill}>
                                {skill.name}
                            </Text>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    </Document>
);

export const generatePDF = async (resume: ResumeData): Promise<Blob> => {
    const doc = <PDFDocument resume={resume} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    return blob;
};

export default PDFDocument;
