"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Download,
  Share2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeEditorSidebar } from "@/components/editor/resume-editor-sidebar";
import { ResumePreview } from "@/components/editor/resume-preview";
import { EditorToolbar } from "@/components/editor/editor-toolbar";

// Editor-specific Resume interface for simpler usage
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
    endDate?: string;
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
    url?: string;
    startDate?: string;
    endDate?: string;
    technologies: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
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
  }>;
  settings: {
    fontSize: number;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    spacing: 'compact' | 'normal' | 'relaxed';
    pageMargins: 'narrow' | 'normal' | 'wide';
  };
  metadata: {
    atsScore: number;
    lastModified: Date;
    version: number;
    isPublic: boolean;
    tags: string[];
  };
}

interface EditorPageProps {
  params?: {
    id?: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize or load resume
  useEffect(() => {
    if (params?.id) {
      // Load existing resume by ID
      // This would typically fetch from API
      console.log('Loading resume with ID:', params.id);
    } else {
      // Create new resume
      const newResume: Resume = {
        id: crypto.randomUUID(),
        title: "New Resume",
        template: "modern",
        personalInfo: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
          summary: "",
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        awards: [],
        customSections: [],
        settings: {
          fontSize: 12,
          fontFamily: "Inter",
          primaryColor: "#3B82F6",
          secondaryColor: "#64748B",
          spacing: "normal",
          pageMargins: "normal",
        },
        metadata: {
          atsScore: 0,
          lastModified: new Date(),
          version: 1,
          isPublic: false,
          tags: [],
        },
      };
      setCurrentResume(newResume);
    }
  }, [params?.id, setCurrentResume]);

  const handleSave = async () => {
    if (!currentResume) return;

    setIsSaving(true);
    try {
      // Mock save function - would integrate with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (currentResume) {
      setCurrentResume({
        ...currentResume,
        title: newTitle,
      });
    }
  };

  const handleResumeChange = (updatedResume: Resume) => {
    setCurrentResume(updatedResume);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              ← Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={currentResume.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="border-none text-lg font-semibold bg-transparent focus:bg-white dark:focus:bg-gray-700 w-64"
              placeholder="Resume Title"
            />
            <Badge variant="outline" className="text-xs">
              {currentResume.template} Template
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar */}
      <EditorToolbar
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoom={zoom}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        onFullPreview={() => setIsFullPreview(!isFullPreview)}
        isFullPreview={isFullPreview}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex  ">
        {!isFullPreview && (
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <ResumeEditorSidebar
              resume={currentResume}
              onResumeChange={handleResumeChange}
            />
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div
              className="bg-white shadow-2xl overflow-hidden transition-all duration-200"
              style={{
                transform: `scale(${zoom / 100})`,
                width: previewMode === 'desktop' ? '8.5in' : '375px',
                minHeight: previewMode === 'desktop' ? '11in' : '667px',
              }}
            >
              <ScrollArea className="h-full">
                <ResumePreview
                  resume={currentResume}
                  zoom={zoom}
                  mode={previewMode}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
