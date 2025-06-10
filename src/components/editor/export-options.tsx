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
    const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'txt'>('pdf');
    const [includePhoto, setIncludePhoto] = useState(false);
    const [includeColors, setIncludeColors] = useState(true);
    const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const handleExport = async () => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            // Convert editor resume to ResumeData format for proper access
            const resumeData = convertEditorResumeToResumeData(resume);
            const fileName = `${resumeData.personal.full_name.replace(/\s+/g, '_')}_Resume.${exportFormat}`;

            if (exportFormat === 'pdf') {
                setExportProgress(20);

                // Find the resume preview element
                const resumeElement = document.querySelector('[data-resume-preview]') as HTMLElement;
                if (!resumeElement) {
                    throw new Error('Resume preview element not found');
                }

                // Helper function to sanitize CSS for PDF export
                const sanitizeCSSForPDF = (element: HTMLElement) => {
                    // Store original styles to restore later
                    const originalStyles = new Map();
                    
                    const allElements = element.querySelectorAll('*');
                    allElements.forEach((el, index) => {
                        const htmlEl = el as HTMLElement;
                        const style = htmlEl.getAttribute('style');
                        originalStyles.set(index, style);
                        
                        if (style) {
                            // Remove problematic CSS functions
                            const cleanStyle = style
                                .replace(/color:\s*oklch[^;]+;?/g, `color: ${safePrimaryColor};`)
                                .replace(/color:\s*hsl[^;]+;?/g, `color: ${safePrimaryColor};`)
                                .replace(/color:\s*var\([^)]+\);?/g, `color: ${safePrimaryColor};`)
                                .replace(/background[^:]*:\s*oklch[^;]+;?/g, 'background: transparent;')
                                .replace(/background[^:]*:\s*linear-gradient[^;]+;?/g, `background: ${safePrimaryColor};`)
                                .replace(/background[^:]*:\s*var\([^)]+\);?/g, 'background: transparent;')
                                .replace(/border[^:]*:\s*var\([^)]+\);?/g, 'border-color: #e5e7eb;');
                            
                            htmlEl.setAttribute('style', cleanStyle);
                        }
                    });
                    
                    return () => {
                        // Restore original styles
                        allElements.forEach((el, index) => {
                            const htmlEl = el as HTMLElement;
                            const originalStyle = originalStyles.get(index);
                            if (originalStyle) {
                                htmlEl.setAttribute('style', originalStyle);
                            } else {
                                htmlEl.removeAttribute('style');
                            }
                        });
                    };
                };

                setExportProgress(40);

                // Helper function to convert any color format to hex
                const convertToHex = (color: string): string => {
                    if (!color) return '#000000';
                    
                    // If already hex, return as-is
                    if (color.startsWith('#')) return color;
                    
                    // Handle oklch colors specifically
                    if (color.includes('oklch')) {
                        // Extract values from oklch(l c h / alpha) format
                        const oklchMatch = color.match(/oklch\(([^)]+)\)/);
                        if (oklchMatch) {
                            return '#1a1a1a'; // Default fallback for oklch
                        }
                    }
                    
                    // Handle CSS variables
                    if (color.includes('var(')) {
                        return '#1a1a1a'; // Default fallback for CSS variables
                    }
                    
                    // Try to compute color using DOM
                    try {
                        const tempEl = document.createElement('div');
                        tempEl.style.color = color;
                        document.body.appendChild(tempEl);
                        const computedColor = window.getComputedStyle(tempEl).color;
                        document.body.removeChild(tempEl);
                        
                        // Convert rgb to hex
                        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (rgbMatch) {
                            const r = parseInt(rgbMatch[1]);
                            const g = parseInt(rgbMatch[2]);
                            const b = parseInt(rgbMatch[3]);
                            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                        }
                    } catch (error) {
                        console.warn('Color conversion failed for:', color, error);
                    }
                    
                    // Fallback to black if conversion fails
                    return '#000000';
                };

                // Convert colors to safe hex values
                const safePrimaryColor = convertToHex(resume.settings?.primaryColor || '#1a1a1a');
                const safeSecondaryColor = convertToHex(resume.settings?.secondaryColor || '#6b7280');

                // Create comprehensive style override for PDF export
                const tempStyle = document.createElement('style');
                tempStyle.textContent = `
                    /* Force all elements to use only hex colors for PDF export */
                    [data-resume-preview], [data-resume-preview] * {
                        /* Override CSS custom properties */
                        --background: #ffffff !important;
                        --foreground: #1a1a1a !important;
                        --primary: ${safePrimaryColor} !important;
                        --secondary: ${safeSecondaryColor} !important;
                        --muted: #f5f5f5 !important;
                        --muted-foreground: #6b7280 !important;
                        --border: #e5e7eb !important;
                        --ring: #9ca3af !important;
                        
                        /* Remove any problematic color functions */
                        background: inherit !important;
                        background-color: inherit !important;
                        border-color: inherit !important;
                        outline-color: inherit !important;
                        text-decoration-color: inherit !important;
                        fill: inherit !important;
                        stroke: inherit !important;
                    }
                    
                    /* Force specific element colors */
                    [data-resume-preview] {
                        background: #ffffff !important;
                        color: #1a1a1a !important;
                    }
                    
                    [data-resume-preview] h1, 
                    [data-resume-preview] h2, 
                    [data-resume-preview] h3,
                    [data-resume-preview] h4,
                    [data-resume-preview] h5,
                    [data-resume-preview] h6 {
                        color: ${safePrimaryColor} !important;
                    }
                    
                    [data-resume-preview] .text-primary,
                    [data-resume-preview] [style*="color: var(--primary)"] {
                        color: ${safePrimaryColor} !important;
                    }
                    
                    [data-resume-preview] .text-secondary,
                    [data-resume-preview] [style*="color: var(--secondary)"] {
                        color: ${safeSecondaryColor} !important;
                    }
                    
                    /* Remove gradients and modern CSS functions */
                    [data-resume-preview] .bg-gradient-to-r,
                    [data-resume-preview] .bg-gradient-to-l,
                    [data-resume-preview] .bg-gradient-to-t,
                    [data-resume-preview] .bg-gradient-to-b,
                    [data-resume-preview] .bg-gradient-to-br,
                    [data-resume-preview] .bg-gradient-to-bl,
                    [data-resume-preview] .bg-gradient-to-tr,
                    [data-resume-preview] .bg-gradient-to-tl {
                        background: ${safePrimaryColor} !important;
                    }
                `;
                document.head.appendChild(tempStyle);

                // Sanitize the DOM for PDF export
                const restoreStyles = sanitizeCSSForPDF(resumeElement);

                let canvas;
                try {
                    // Convert HTML to canvas with improved error handling
                    canvas = await html2canvas(resumeElement, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        width: resumeElement.scrollWidth,
                        height: resumeElement.scrollHeight,
                        logging: false,
                        foreignObjectRendering: false, // Disable for better compatibility
                        ignoreElements: (element) => {
                            // Skip problematic elements
                            return element.tagName === 'SCRIPT' || 
                                   element.tagName === 'STYLE' || 
                                   element.hasAttribute('data-html2canvas-ignore') ||
                                   element.classList.contains('no-export');
                        },
                        onclone: (clonedDoc) => {
                            // Apply comprehensive safe styling to cloned document
                            const clonedStyle = clonedDoc.createElement('style');
                            clonedStyle.textContent = `
                                /* Reset all color-related properties to safe values */
                                * { 
                                    color: inherit !important; 
                                    background-color: transparent !important;
                                    border-color: #e5e7eb !important;
                                    outline-color: transparent !important;
                                }
                                
                                body { 
                                    background: #ffffff !important; 
                                    color: #1a1a1a !important; 
                                    font-family: ${resume.settings?.fontFamily || 'Arial, sans-serif'} !important;
                                }
                                
                                /* Force heading colors */
                                h1, h2, h3, h4, h5, h6 { 
                                    color: ${safePrimaryColor} !important; 
                                    background: transparent !important;
                                }
                                
                                /* Remove all modern CSS color functions */
                                [style*="oklch"], [style*="hsl"], [style*="rgb"], [style*="var("] {
                                    color: ${safePrimaryColor} !important;
                                    background-color: transparent !important;
                                }
                                
                                /* Ensure gradients are replaced with solid colors */
                                [class*="gradient"] {
                                    background: ${safePrimaryColor} !important;
                                    background-image: none !important;
                                }
                                
                                /* Safe border and text colors */
                                .border { border-color: #e5e7eb !important; }
                                .text-gray-600 { color: #6b7280 !important; }
                                .text-gray-700 { color: #374151 !important; }
                                .text-gray-800 { color: #1f2937 !important; }
                                .text-gray-900 { color: #111827 !important; }
                            `;
                            clonedDoc.head.appendChild(clonedStyle);
                            
                            // Remove any remaining problematic styles
                            const allElements = clonedDoc.querySelectorAll('*');
                            allElements.forEach(el => {
                                const style = el.getAttribute('style');
                                if (style && (style.includes('oklch') || style.includes('hsl(') || style.includes('var('))) {
                                    // Remove problematic inline styles
                                    el.setAttribute('style', style
                                        .replace(/color:\s*oklch[^;]+;?/g, `color: ${safePrimaryColor};`)
                                        .replace(/color:\s*hsl[^;]+;?/g, `color: ${safePrimaryColor};`)
                                        .replace(/color:\s*var\([^)]+\);?/g, `color: ${safePrimaryColor};`)
                                        .replace(/background[^:]*:\s*oklch[^;]+;?/g, 'background: transparent;')
                                        .replace(/background[^:]*:\s*hsl[^;]+;?/g, 'background: transparent;')
                                        .replace(/background[^:]*:\s*var\([^)]+\);?/g, 'background: transparent;')
                                    );
                                }
                            });
                        }
                    });
                } catch (canvasError) {
                    console.warn('HTML2Canvas with advanced options failed, trying simplified approach:', canvasError);
                    
                    // Try with minimal configuration to avoid color issues
                    try {
                        canvas = await html2canvas(resumeElement, {
                            scale: 1.5,
                            backgroundColor: '#ffffff',
                            logging: false,
                            useCORS: false,
                            allowTaint: false,
                            foreignObjectRendering: false,
                            onclone: (clonedDoc) => {
                                // Apply minimal safe styling
                                const safeStyle = clonedDoc.createElement('style');
                                safeStyle.textContent = `
                                    * { 
                                        color: #333 !important; 
                                        background-color: transparent !important;
                                    }
                                    body { 
                                        background: #ffffff !important; 
                                        color: #333 !important; 
                                    }
                                    h1, h2, h3, h4, h5, h6 { 
                                        color: #1a1a1a !important; 
                                    }
                                `;
                                clonedDoc.head.appendChild(safeStyle);
                            }
                        });
                    } catch (simplifiedError) {
                        console.error('Even simplified html2canvas failed:', simplifiedError);
                        throw new Error('PDF export failed due to color format compatibility issues. Please try a different export format or contact support.');
                    }
                } finally {
                    // Clean up temporary style and restore original styles
                    document.head.removeChild(tempStyle);
                    restoreStyles();
                }

                setExportProgress(70);

                // Create PDF
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: pageSize === 'a4' ? 'a4' : 'letter',
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * pageWidth) / canvas.width;

                if (imgHeight <= pageHeight) {
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                } else {
                    let heightLeft = imgHeight;
                    let position = 0;

                    while (heightLeft > 0) {
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                        position -= pageHeight;

                        if (heightLeft > 0) {
                            pdf.addPage();
                        }
                    }
                }

                setExportProgress(90);
                pdf.save(fileName);
                toast.success('PDF exported successfully!');

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
            }

            setExportProgress(100);

        } catch (error) {
            console.error('Export failed:', error);
            
            // Provide detailed user-friendly error messages with toast
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (errorMessage.includes('oklch') || errorMessage.includes('color function') || errorMessage.includes('color format')) {
                toast.error('PDF export failed due to unsupported color formats. Try switching templates or exporting as HTML.');
            } else if (errorMessage.includes('Resume preview element not found')) {
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
            console.log('Share link copied to clipboard');
        } catch (error) {
            console.error('Failed to copy link:', error);
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
                        <RadioGroup value={exportFormat} onValueChange={(value: 'pdf' | 'word' | 'txt') => setExportFormat(value)}>
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
