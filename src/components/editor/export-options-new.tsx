"use client";

import { useState } from "react";
import { Download, FileDown, Mail, Link, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { convertEditorResumeToResumeData, type EditorResume } from "@/lib/data-converter";
import type { ResumeData } from "@/types/resume";
import { toast } from "sonner";

interface ExportOptionsProps {
    resume: EditorResume;
}

export function ExportOptions({ resume }: ExportOptionsProps) {
    const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'txt' | 'json'>('pdf');
    const [includePhoto, setIncludePhoto] = useState(false);
    const [includeColors, setIncludeColors] = useState(true);
    const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const handleExport = async () => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            const resumeData = convertEditorResumeToResumeData(resume);
            const fileName = `${resumeData.personal.full_name.replace(/\s+/g, '_')}_Resume.${exportFormat}`;

            if (exportFormat === 'pdf') {
                setExportProgress(20);

                try {
                    setExportProgress(50);

                    // Use browser's built-in print functionality for PDF export
                    // This gives 100% accuracy since it prints exactly what the user sees
                    const printWindow = window.open('', '_blank');

                    if (!printWindow) {
                        throw new Error('Please allow popups to export PDF');
                    }

                    setExportProgress(70);

                    // Convert resume data for the print view
                    const resumeData = convertEditorResumeToResumeData(resume);

                    // Create the HTML content for printing
                    const printContent = generatePrintableHTML(resumeData);

                    // Write the content to the new window
                    printWindow.document.write(printContent);
                    printWindow.document.close();

                    setExportProgress(90);

                    // Wait for content to load, then trigger print
                    printWindow.onload = () => {
                        setTimeout(() => {
                            printWindow.print();
                            setExportProgress(100);
                            toast.success('PDF export opened!', {
                                description: 'Use your browser\'s print dialog to save as PDF.',
                            });
                        }, 500);
                    };

                } catch (error) {
                    console.error('PDF export failed:', error);
                    toast.error('PDF export failed', {
                        description: error instanceof Error ? error.message : 'Failed to open print dialog'
                    });
                }

            } else if (exportFormat === 'word') {
                const resumeData = convertEditorResumeToResumeData(resume);
                const htmlContent = generateHTMLResume(resumeData);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('HTML document exported successfully!');

            } else if (exportFormat === 'txt') {
                const resumeData = convertEditorResumeToResumeData(resume);
                const textContent = generateTextResume(resumeData);
                const blob = new Blob([textContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Text file exported successfully!');

            } else if (exportFormat === 'json') {
                const resumeData = convertEditorResumeToResumeData(resume);
                const jsonContent = JSON.stringify(resumeData, null, 2);
                const blob = new Blob([jsonContent], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName.replace('.json', '') + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('JSON file exported successfully!');
            }

            setExportProgress(100);

        } catch (error) {
            console.error('Export failed:', error);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            if (errorMessage.includes('Resume preview element not found')) {
                toast.error('Could not find the resume preview. Please reload and try again.');
            } else if (errorMessage.includes('html2canvas')) {
                toast.error('PDF export failed due to rendering issues. Try exporting as HTML format instead.');
            } else {
                toast.error(`Export failed: ${errorMessage}`);
            }
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const generateHTMLResume = (resume: ResumeData) => {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${resume.personal.full_name} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1 { color: #333; }
        h2 { color: #333; border-bottom: 1px solid #ccc; }
        .contact-info { margin-bottom: 20px; }
        .section { margin-bottom: 25px; }
    </style>
</head>
<body>
    <h1>${resume.personal.full_name}</h1>
    <div class="contact-info">
        <p>Email: ${resume.personal.email}</p>
        ${resume.personal.phone ? `<p>Phone: ${resume.personal.phone}</p>` : ''}
        ${resume.personal.location ? `<p>Location: ${resume.personal.location}</p>` : ''}
        ${resume.personal.website ? `<p>Website: ${resume.personal.website}</p>` : ''}
        ${resume.personal.linkedin ? `<p>LinkedIn: ${resume.personal.linkedin}</p>` : ''}
    </div>
    
    ${resume.summary ? `
    <div class="section">
        <h2>Summary</h2>
        <p>${resume.summary}</p>
    </div>
    ` : ''}
    
    ${resume.experience?.length ? `
    <div class="section">
        <h2>Experience</h2>
        ${resume.experience.map(exp => `
        <div>
            <h3>${exp.position} at ${exp.company}</h3>
            <p><strong>Duration:</strong> ${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'Present'}</p>
            ${exp.location ? `<p><strong>Location:</strong> ${exp.location}</p>` : ''}
            <p>${exp.description}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${resume.education?.length ? `
    <div class="section">
        <h2>Education</h2>
        ${resume.education.map(edu => `
        <div>
            <h3>${edu.degree}</h3>
            <p><strong>Institution:</strong> ${edu.institution}</p>
            <p><strong>Duration:</strong> ${edu.start_date} - ${edu.end_date || 'Present'}</p>
            ${edu.gpa ? `<p><strong>GPA:</strong> ${edu.gpa}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${resume.skills?.length ? `
    <div class="section">
        <h2>Skills</h2>
        <p>${resume.skills.map(skill => skill.name).join(', ')}</p>
    </div>
    ` : ''}
</body>
</html>`;
    };

    const generateTextResume = (resume: ResumeData) => {
        let text = `${resume.personal.full_name}\n`;
        text += '='.repeat(text.length - 1) + '\n\n';

        text += 'CONTACT INFORMATION\n';
        text += `-Email: ${resume.personal.email}\n`;
        if (resume.personal.phone) text += `-Phone: ${resume.personal.phone}\n`;
        if (resume.personal.location) text += `-Location: ${resume.personal.location}\n`;
        if (resume.personal.website) text += `-Website: ${resume.personal.website}\n`;
        if (resume.personal.linkedin) text += `-LinkedIn: ${resume.personal.linkedin}\n`;
        text += '\n';

        if (resume.summary) {
            text += 'SUMMARY\n';
            text += '-'.repeat(7) + '\n';
            text += `${resume.summary}\n\n`;
        }

        if (resume.experience?.length) {
            text += 'EXPERIENCE\n';
            text += '-'.repeat(10) + '\n';
            resume.experience.forEach(exp => {
                text += `${exp.position} at ${exp.company}\n`;
                text += `${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'Present'}`;
                if (exp.location) text += ` | ${exp.location}`;
                text += '\n';
                text += `${exp.description}\n`;
                text += '\n';
            });
        }

        if (resume.education?.length) {
            text += 'EDUCATION\n';
            text += '-'.repeat(9) + '\n';
            resume.education.forEach(edu => {
                text += `${edu.degree}\n`;
                text += `${edu.institution}\n`;
                text += `${edu.start_date} - ${edu.end_date || 'Present'}\n`;
                if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
                text += '\n';
            });
        }

        if (resume.skills?.length) {
            text += 'SKILLS\n';
            text += '-'.repeat(6) + '\n';
            text += `${resume.skills.map(skill => skill.name).join(', ')}\n\n`;
        }

        return text;
    };

    const handleEmailExport = () => {
        const resumeData = convertEditorResumeToResumeData(resume);
        const subject = encodeURIComponent(`Resume - ${resumeData.personal.full_name}`);
        const body = encodeURIComponent(`Please find my attached resume.

Best regards,
${resumeData.personal.full_name}`);

        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handleShareLink = async () => {
        const shareUrl = `${window.location.origin}/resume/shared`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Share link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
            toast.error('Failed to copy share link');
        }
    };

    // Generate printable HTML for browser's print functionality
    function generatePrintableHTML(resumeData: ResumeData): string {
        const { personal, summary, experience, education, skills, projects, achievements, certifications, languages } = resumeData;
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personal.full_name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @media print {
            @page {
                margin: 0.5in;
                size: A4;
            }
            
            body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 8px;
        }
        
        .contact {
            font-size: 10pt;
            color: #666;
        }
        
        .contact span {
            margin: 0 10px;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 4px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .item {
            margin-bottom: 12px;
        }
        
        .item-title {
            font-size: 12pt;
            font-weight: bold;
            color: #1f2937;
        }
        
        .item-subtitle {
            font-size: 11pt;
            color: #2563eb;
            font-weight: 500;
        }
        
        .item-meta {
            font-size: 10pt;
            color: #6b7280;
            margin: 2px 0;
        }
        
        .item-description {
            font-size: 11pt;
            color: #374151;
            margin-top: 4px;
            text-align: justify;
        }
        
        .summary {
            font-size: 11pt;
            color: #374151;
            text-align: justify;
            line-height: 1.5;
        }
        
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill {
            background: #f3f4f6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10pt;
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        
        .achievements-list {
            list-style: none;
        }
        
        .achievements-list li {
            margin-bottom: 4px;
            font-size: 11pt;
            color: #374151;
        }
        
        .achievements-list li:before {
            content: "•";
            color: #2563eb;
            font-weight: bold;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${personal.full_name}</h1>
        <div class="contact">
            ${personal.email ? `<span>📧 ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
            ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
            ${personal.website ? `<span>🌐 ${personal.website}</span>` : ''}
            ${personal.linkedin ? `<span>💼 LinkedIn</span>` : ''}
        </div>
    </div>
    
    ${summary ? `
    <div class="section">
        <h2 class="section-title">Summary</h2>
        <p class="summary">${summary}</p>
    </div>
    ` : ''}
    
    ${experience && experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Experience</h2>
        ${experience.map(exp => `
        <div class="item">
            <div class="item-title">${exp.position}</div>
            <div class="item-subtitle">${exp.company}</div>
            <div class="item-meta">
                ${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'Present'}
                ${exp.location ? ` • ${exp.location}` : ''}
            </div>
            <div class="item-description">${exp.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${education && education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
        <div class="item">
            <div class="item-title">${edu.degree}</div>
            <div class="item-subtitle">${edu.institution}</div>
            <div class="item-meta">
                ${edu.start_date} - ${edu.end_date || 'Present'}
                ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${skills && skills.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
            ${skills.map(skill => `<span class="skill">${skill.name}</span>`).join('')}
        </div>
    </div>
    ` : ''}
    
    ${projects && projects.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Projects</h2>
        ${projects.map(project => `
        <div class="item">
            <div class="item-title">${project.name}</div>
            <div class="item-meta">
                ${project.start_date ? `${project.start_date} - ${project.end_date || 'Present'}` : ''}
                ${project.url ? ` • ${project.url}` : ''}
            </div>
            <div class="item-description">${project.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${certifications && certifications.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Certifications</h2>
        ${certifications.map(cert => `
        <div class="item">
            <div class="item-title">${cert.name}</div>
            <div class="item-subtitle">${cert.issuer}</div>
            <div class="item-meta">
                ${cert.issue_date}${cert.expiry_date ? ` - ${cert.expiry_date}` : ''}
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    ${languages && languages.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="skills-grid">
            ${languages.map(lang => `<span class="skill">${lang.name} (${lang.proficiency})</span>`).join('')}
        </div>
    </div>
    ` : ''}
    
    ${achievements && achievements.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Achievements</h2>
        <ul class="achievements-list">
            ${achievements.map(achievement => `
            <li>${achievement.title}${achievement.issuer ? ` - ${achievement.issuer}` : ''}${achievement.date ? ` (${achievement.date})` : ''}</li>
            `).join('')}
        </ul>
    </div>
    ` : ''}
    
</body>
</html>
    `.trim();
}

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileDown className="w-5 h-5" />
                        Export Resume
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Export Format</Label>
                        <RadioGroup value={exportFormat} onValueChange={(value: 'pdf' | 'word' | 'txt' | 'json') => setExportFormat(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pdf" id="pdf" />
                                <Label htmlFor="pdf" className="flex items-center gap-2">
                                    PDF Document
                                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="word" id="word" />
                                <Label htmlFor="word">HTML Document (.html)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="txt" id="txt" />
                                <Label htmlFor="txt">Plain Text (.txt)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="json" id="json" />
                                <Label htmlFor="json">JSON Data (.json)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Separator />

                    {/* Export Options */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Export Options</Label>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="include-colors" className="text-sm">Include colors and styling</Label>
                            <Switch
                                id="include-colors"
                                checked={includeColors}
                                onCheckedChange={setIncludeColors}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="include-photo" className="text-sm">Include profile photo</Label>
                            <Switch
                                id="include-photo"
                                checked={includePhoto}
                                onCheckedChange={setIncludePhoto}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Page Size</Label>
                            <RadioGroup value={pageSize} onValueChange={(value: 'a4' | 'letter') => setPageSize(value)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="a4" id="a4" />
                                    <Label htmlFor="a4">A4 (International)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="letter" id="letter" />
                                    <Label htmlFor="letter">Letter (US)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full"
                        >
                            {isExporting ? (
                                <>
                                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                                    Exporting... {exportProgress}%
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export {exportFormat.toUpperCase()}
                                </>
                            )}
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" onClick={handleEmailExport} size="sm">
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                            </Button>
                            <Button variant="outline" onClick={handleShareLink} size="sm">
                                <Link className="w-4 h-4 mr-1" />
                                Share Link
                            </Button>
                        </div>
                    </div>

                    {/* Export Progress */}
                    {isExporting && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${exportProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
