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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

                // Find the resume preview element
                const resumeElement = document.querySelector('[data-resume-preview]') as HTMLElement;
                if (!resumeElement) {
                    throw new Error('Resume preview element not found');
                }

                setExportProgress(40);

                // Create a clean clone for PDF export
                const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

                // Apply comprehensive PDF-friendly styles
                const applyPDFStyles = (element: HTMLElement) => {
                    const allElements = element.querySelectorAll('*');
                    allElements.forEach((el) => {
                        const htmlEl = el as HTMLElement;

                        // Force clean, readable styles
                        htmlEl.style.color = '#1a1a1a';
                        htmlEl.style.backgroundColor = 'transparent';
                        htmlEl.style.backgroundImage = 'none';
                        htmlEl.style.boxShadow = 'none';
                        htmlEl.style.textShadow = 'none';
                        htmlEl.style.filter = 'none';
                        htmlEl.style.backdropFilter = 'none';

                        // Fix headings
                        if (htmlEl.tagName.match(/^H[1-6]$/)) {
                            htmlEl.style.color = '#1f2937';
                            htmlEl.style.fontWeight = 'bold';
                        }

                        // Fix icons
                        if (htmlEl.tagName === 'svg') {
                            htmlEl.style.display = 'inline-block';
                            htmlEl.style.verticalAlign = 'middle';
                            htmlEl.style.marginRight = '6px';
                            htmlEl.style.width = '16px';
                            htmlEl.style.height = '16px';
                            htmlEl.style.color = '#374151';
                        }

                        // Fix flex containers
                        if (htmlEl.classList.contains('flex')) {
                            htmlEl.style.display = 'flex';
                            htmlEl.style.alignItems = 'center';
                        }

                        // Remove gradients and white text
                        if (htmlEl.style.background && htmlEl.style.background.includes('gradient')) {
                            htmlEl.style.background = '#f8fafc';
                        }

                        if (htmlEl.classList.contains('text-white') || htmlEl.style.color === 'white') {
                            htmlEl.style.color = '#1a1a1a';
                        }
                    });
                };

                applyPDFStyles(clonedElement);

                // Temporarily add to DOM for rendering
                clonedElement.style.position = 'fixed';
                clonedElement.style.top = '-9999px';
                clonedElement.style.left = '-9999px';
                clonedElement.style.width = resumeElement.offsetWidth + 'px';
                clonedElement.style.height = 'auto';
                clonedElement.style.background = '#ffffff';
                document.body.appendChild(clonedElement);

                setExportProgress(60);

                // Convert to canvas with optimized settings
                const canvas = await html2canvas(clonedElement, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    logging: false,
                    removeContainer: true,
                    foreignObjectRendering: false,
                    imageTimeout: 15000,
                    onclone: (clonedDoc) => {
                        // Add comprehensive CSS reset
                        const style = clonedDoc.createElement('style');
                        style.textContent = `
                            * {
                                color: #1a1a1a !important;
                                background-image: none !important;
                                box-shadow: none !important;
                                text-shadow: none !important;
                                filter: none !important;
                                backdrop-filter: none !important;
                            }
                            
                            body {
                                background: #ffffff !important;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
                            }
                            
                            h1, h2, h3, h4, h5, h6 {
                                color: #1f2937 !important;
                                font-weight: bold !important;
                            }
                            
                            .text-white, [style*="color: white"] {
                                color: #1a1a1a !important;
                            }
                            
                            [class*="gradient"], [style*="gradient"] {
                                background: #f8fafc !important;
                                background-image: none !important;
                            }
                            
                            svg {
                                display: inline-block !important;
                                vertical-align: middle !important;
                                margin-right: 6px !important;
                                width: 16px !important;
                                height: 16px !important;
                                color: #374151 !important;
                            }
                            
                            .flex {
                                display: flex !important;
                                align-items: center !important;
                            }
                        `;
                        clonedDoc.head.appendChild(style);
                    }
                });

                // Remove the temporary element
                document.body.removeChild(clonedElement);

                setExportProgress(80);

                // Create high-quality PDF
                const imgData = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: pageSize === 'a4' ? 'a4' : 'letter',
                    compress: true,
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 10;
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let yPosition = margin;

                if (imgHeight <= pageHeight - (margin * 2)) {
                    // Single page
                    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight, '', 'FAST');
                } else {
                    // Multi-page handling
                    let remainingHeight = imgHeight;
                    const pageContentHeight = pageHeight - (margin * 2);

                    while (remainingHeight > 0) {
                        const currentPageHeight = Math.min(remainingHeight, pageContentHeight);
                        const sourceY = (imgHeight - remainingHeight) * (canvas.height / imgHeight);
                        const sourceHeight = currentPageHeight * (canvas.height / imgHeight);

                        const pageCanvas = document.createElement('canvas');
                        pageCanvas.width = canvas.width;
                        pageCanvas.height = sourceHeight;
                        const pageCtx = pageCanvas.getContext('2d');

                        if (pageCtx) {
                            pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
                            const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
                            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, currentPageHeight, '', 'FAST');
                        }

                        remainingHeight -= pageContentHeight;

                        if (remainingHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }

                setExportProgress(95);
                pdf.save(fileName);

                toast.success('PDF exported successfully!', {
                    description: 'Your resume has been downloaded as a high-quality PDF.',
                });

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
