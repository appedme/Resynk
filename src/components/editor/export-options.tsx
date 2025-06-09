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
  // ... other sections would be included in real implementation
}

interface ExportOptionsProps {
  resume: Resume;
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
      const fileName = `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_Resume.${exportFormat}`;
      
      if (exportFormat === 'pdf') {
        // Update progress
        setExportProgress(20);
        
        // Find the resume preview element
        const resumeElement = document.querySelector('[data-resume-preview]') as HTMLElement;
        if (!resumeElement) {
          throw new Error('Resume preview element not found');
        }

        setExportProgress(40);

        // Convert HTML to canvas
        const canvas = await html2canvas(resumeElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: resumeElement.scrollWidth,
          height: resumeElement.scrollHeight,
        });

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

        // If image is taller than page, we need to handle multiple pages
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

        // Download the PDF
        pdf.save(fileName);
        
      } else if (exportFormat === 'word') {
        // For Word export, we'll create a simple HTML version
        const htmlContent = generateHTMLResume(resume);
        const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
      } else if (exportFormat === 'txt') {
        // Generate plain text version
        const textContent = generateTextResume(resume);
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setExportProgress(100);

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const generateHTMLResume = (resume: Resume) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        h1 { color: ${resume.settings?.primaryColor || '#333'}; }
        h2 { color: ${resume.settings?.primaryColor || '#333'}; border-bottom: 1px solid #ccc; }
        .contact-info { margin-bottom: 20px; }
        .section { margin-bottom: 25px; }
    </style>
</head>
<body>
    <h1>${resume.personalInfo.firstName} ${resume.personalInfo.lastName}</h1>
    <div class="contact-info">
        <p>Email: ${resume.personalInfo.email}</p>
        <p>Phone: ${resume.personalInfo.phone}</p>
        <p>Location: ${resume.personalInfo.location}</p>
        ${resume.personalInfo.website ? `<p>Website: ${resume.personalInfo.website}</p>` : ''}
        ${resume.personalInfo.linkedin ? `<p>LinkedIn: ${resume.personalInfo.linkedin}</p>` : ''}
    </div>
    
    ${resume.personalInfo.summary ? `
    <div class="section">
        <h2>Summary</h2>
        <p>${resume.personalInfo.summary}</p>
    </div>
    ` : ''}
    
    ${resume.experience?.length ? `
    <div class="section">
        <h2>Experience</h2>
        ${resume.experience.map(exp => `
        <div>
            <h3>${exp.position} at ${exp.company}</h3>
            <p><strong>Duration:</strong> ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'Present'}</p>
            <p><strong>Location:</strong> ${exp.location}</p>
            <p>${exp.description}</p>
            ${exp.technologies?.length ? `<p><strong>Technologies:</strong> ${exp.technologies.join(', ')}</p>` : ''}
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
            <p><strong>Duration:</strong> ${edu.startDate} - ${edu.endDate || 'Present'}</p>
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

  const generateTextResume = (resume: Resume) => {
    let text = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}\n`;
    text += '='.repeat(text.length - 1) + '\n\n';
    
    text += 'CONTACT INFORMATION\n';
    text += `-Email: ${resume.personalInfo.email}\n`;
    text += `-Phone: ${resume.personalInfo.phone}\n`;
    text += `-Location: ${resume.personalInfo.location}\n`;
    if (resume.personalInfo.website) text += `-Website: ${resume.personalInfo.website}\n`;
    if (resume.personalInfo.linkedin) text += `-LinkedIn: ${resume.personalInfo.linkedin}\n`;
    text += '\n';
    
    if (resume.personalInfo.summary) {
      text += 'SUMMARY\n';
      text += '-'.repeat(7) + '\n';
      text += `${resume.personalInfo.summary}\n\n`;
    }
    
    if (resume.experience?.length) {
      text += 'EXPERIENCE\n';
      text += '-'.repeat(10) + '\n';
      resume.experience.forEach(exp => {
        text += `${exp.position} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'Present'} | ${exp.location}\n`;
        text += `${exp.description}\n`;
        if (exp.technologies?.length) text += `Technologies: ${exp.technologies.join(', ')}\n`;
        text += '\n';
      });
    }
    
    if (resume.education?.length) {
      text += 'EDUCATION\n';
      text += '-'.repeat(9) + '\n';
      resume.education.forEach(edu => {
        text += `${edu.degree}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.endDate || 'Present'}\n`;
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
    const subject = encodeURIComponent(`Resume - ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`);
    const body = encodeURIComponent(`Please find my attached resume.

Best regards,
${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareLink = async () => {
    // In a real implementation, this would generate a shareable link
    const shareUrl = `${window.location.origin}/resume/${resume.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Could show a toast notification here
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
                <Label htmlFor="word">Microsoft Word (.docx)</Label>
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
