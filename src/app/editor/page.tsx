"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import {
  Save,
  Share2,
  Settings,
  Sparkles,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeEditorSidebar } from "@/components/editor/resume-editor-sidebar";
import { ResumePreview } from "@/components/editor/resume-preview";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { ExportOptions } from "@/components/editor/export-options-new";
import { SaveLoadDialog } from "@/components/editor/save-load-dialog";
import { getSampleResumeData } from "@/lib/sample-data";
import { useSaveLoad } from "@/lib/save-load-service-fixed";
import { convertEditorResumeToResumeData, convertResumeDataToEditorResume } from "@/lib/resume-converter";
import type { ResumeData } from "@/types/resume";
import { Toaster, toast } from "sonner";

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
  const user = useUser();
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Use the actual save/load service
  const {
    isLoading: isSaving,
    saveResume,
    loadResume,
    autoSave,
    loadCurrentResume,
  } = useSaveLoad();

  // Auto-save functionality
  useEffect(() => {
    if (!currentResume) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-saving resume...');
        const resumeData = convertEditorResumeToResumeData(currentResume);
        const savedId = await autoSave(resumeData);
        console.log('✅ Auto-save completed with ID:', savedId);
        
        // Update the current resume ID if it changed during auto-save
        if (savedId && currentResume.id !== savedId) {
          setCurrentResume(prev => prev ? { ...prev, id: savedId } : null);
        }
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [currentResume, autoSave]);

  // Undo/Redo functionality
  const [history, setHistory] = useState<Resume[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize or load resume
  useEffect(() => {
    const initializeResume = async () => {
      if (params?.id) {
        // Load existing resume by ID from save/load service
        try {
          console.log('📥 Loading resume with ID:', params.id);
          const resumeData = await loadResume(params.id);
          if (resumeData) {
            const editorResume = convertResumeDataToEditorResume(resumeData, params.id);
            setCurrentResume(editorResume);
            console.log('✅ Resume loaded successfully:', editorResume.title);
            toast.success('Resume loaded successfully');
          } else {
            console.error('❌ Failed to load resume - resume not found');
            toast.error('Resume not found. Creating new resume.');
            // Fallback to new resume
            createNewResume();
          }
        } catch (error) {
          console.error('❌ Error loading resume:', error);
          toast.error('Error loading resume. Creating new resume.');
          createNewResume();
        }
      } else {
        // Try to load the current resume (last edited) when no ID is provided
        try {
          console.log('🔍 Checking for current resume...');
          const currentResumeData = await loadCurrentResume();
          if (currentResumeData) {
            const editorResume = convertResumeDataToEditorResume(currentResumeData);
            setCurrentResume(editorResume);
            console.log('✅ Loaded current resume:', editorResume.title);
            toast.success(`Continued editing: ${editorResume.title}`);
            
            // Update URL to reflect the current resume
            if (editorResume.id) {
              window.history.replaceState(null, '', `/editor/${editorResume.id}`);
            }
          } else {
            console.log('🆕 No current resume found, creating new resume');
            createNewResume();
          }
        } catch (error) {
          console.error('❌ Error loading current resume:', error);
          console.log('🆕 Creating new resume as fallback');
          createNewResume();
        }
      }
    };

    const createNewResume = () => {
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
    };

    initializeResume();
  }, [params?.id, loadResume, loadCurrentResume]);

  const handleSave = async () => {
    if (!currentResume) return;

    try {
      console.log('💾 Starting save process...', currentResume.title);

      // Convert editor resume to ResumeData format for saving
      const resumeData = convertEditorResumeToResumeData(currentResume);
      console.log('🔄 Converted resume data:', resumeData);

      const resumeId = await saveResume(resumeData, currentResume.title);
      console.log('✅ Save completed with ID:', resumeId);

      // Update the current resume with the saved ID to ensure consistency
      if (resumeId && currentResume.id !== resumeId) {
        setCurrentResume(prev => prev ? { ...prev, id: resumeId } : null);
      }

      setLastSaved(new Date());
      toast.success('Resume saved successfully to database');

      // Only update URL quietly if it's a brand new resume (no existing params.id)
      // This prevents unwanted navigation redirects when saving existing resumes
      if (!params?.id && resumeId && window.history.replaceState) {
        console.log('🔗 Quietly updating URL with resume ID:', resumeId);
        window.history.replaceState(null, '', `/editor/${resumeId}`);
      }
    } catch (error) {
      console.error('❌ Failed to save resume:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && error.message === 'AUTHENTICATION_REQUIRED') {
        toast.error('Please sign in to save your resume to the database');
        // Redirect to sign-in with return URL
        router.push(`/handler/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      
      toast.error('Failed to save resume. Please try again.');
      toast.error('Failed to save resume');
    }
  };

  const handleLoadResume = (resumeData: ResumeData) => {
    try {
      console.log('📄 Loading resume data:', resumeData);
      const editorResume = convertResumeDataToEditorResume(resumeData);
      console.log('🔄 Converted to editor format:', editorResume);
      setCurrentResume(editorResume);
      toast.success('Resume loaded successfully');
    } catch (error) {
      console.error('❌ Error loading resume:', error);
      toast.error('Failed to load resume');
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
    // Add to history for undo/redo
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentResume!);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);

    setCurrentResume(updatedResume);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentResume(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentResume(history[historyIndex + 1]);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!currentResume) return;

    try {
      const shareUrl = `${window.location.origin}/resume/shared/${currentResume.id || 'preview'}`;

      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: `${currentResume.title} - Resume`,
          text: `Check out my resume: ${currentResume.title}`,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying URL
      try {
        const shareUrl = `${window.location.origin}/resume/shared/${currentResume.id || 'preview'}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to share or copy link. Please try again.');
      }
    }
  };

  const handleTemplateChange = (newTemplate: 'modern' | 'professional' | 'creative') => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        template: newTemplate,
        metadata: {
          ...currentResume.metadata,
          lastModified: new Date(),
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handleFontSizeChange = (size: number) => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          fontSize: size,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handleFontFamilyChange = (family: string) => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          fontFamily: family,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handlePrimaryColorChange = (color: string) => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          primaryColor: color,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handleSecondaryColorChange = (color: string) => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          secondaryColor: color,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'relaxed') => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          spacing: spacing,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handlePageMarginsChange = (margins: 'narrow' | 'normal' | 'wide') => {
    if (currentResume) {
      const updatedResume = {
        ...currentResume,
        settings: {
          ...currentResume.settings,
          pageMargins: margins,
        }
      };
      handleResumeChange(updatedResume);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // Prefill functionality
  const handlePrefillWithSampleData = () => {
    if (!currentResume) return;

    const sampleData = getSampleResumeData();
    const updatedResume: Resume = {
      ...currentResume,
      personalInfo: sampleData.personalInfo,
      experience: sampleData.experience,
      education: sampleData.education,
      skills: sampleData.skills,
      projects: sampleData.projects,
      certifications: sampleData.certifications,
      languages: sampleData.languages,
      awards: sampleData.awards,
      customSections: sampleData.customSections
    };
    setCurrentResume(updatedResume);
    setHistory(prev => [...prev, updatedResume]);
    setHistoryIndex(prev => prev + 1);
    toast.success('Resume filled with sample data!', {
      description: 'You can now edit any field by clicking on it in the preview.'
    });
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
            {/* Authentication Status */}
            {!user ? (
              <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                <User className="w-3 h-3 text-amber-600" />
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  Sign in to save to database
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => router.push('/handler/sign-in')}
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <User className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-700 dark:text-green-300">
                  Signed in as {user.displayName || user.primaryEmail}
                </span>
              </div>
            )}
            
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
              className={!user ? "border-amber-300 text-amber-700 hover:bg-amber-50" : ""}
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : (!user ? 'Save Locally' : 'Save')}
            </Button>
            <SaveLoadDialog
              currentResume={currentResume ? convertEditorResumeToResumeData(currentResume) : {} as ResumeData}
              onLoad={handleLoadResume}
              trigger={
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save / Load
                </Button>
              }
            />
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrefillWithSampleData}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 hover:from-purple-500/20 hover:to-pink-500/20"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Prefill
            </Button>
            <ExportOptions resume={currentResume} />
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar */}
      <EditorToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoom={zoom}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        onFullPreview={() => setIsFullPreview(!isFullPreview)}
        isFullPreview={isFullPreview}
        template={currentResume.template}
        onTemplateChange={handleTemplateChange}
        fontSize={currentResume.settings.fontSize}
        fontFamily={currentResume.settings.fontFamily}
        onFontSizeChange={handleFontSizeChange}
        onFontFamilyChange={handleFontFamilyChange}
        primaryColor={currentResume.settings.primaryColor}
        secondaryColor={currentResume.settings.secondaryColor}
        onPrimaryColorChange={handlePrimaryColorChange}
        onSecondaryColorChange={handleSecondaryColorChange}
        spacing={currentResume.settings.spacing}
        pageMargins={currentResume.settings.pageMargins}
        onSpacingChange={handleSpacingChange}
        onPageMarginsChange={handlePageMarginsChange}
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
                  onResumeUpdate={handleResumeChange}
                  isInlineEditingEnabled={true}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
