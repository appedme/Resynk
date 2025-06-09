"use client";

import { useState, useRef } from "react";
import { Save, FolderOpen, Trash2, Download, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useSaveLoad } from "@/hooks/use-save-load";
import { formatDistanceToNow } from "date-fns";
import type { ResumeData } from "@/types/resume";

interface SaveLoadDialogProps {
  currentResume: ResumeData;
  onLoad: (resumeData: ResumeData) => void;
  trigger?: React.ReactNode;
}

export function SaveLoadDialog({ currentResume, onLoad, trigger }: SaveLoadDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [saveTitle, setSaveTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    savedResumes,
    currentResumeId,
    isLoading,
    isSaving,
    saveResume,
    loadResume,
    deleteResume,
    exportResume,
    importResume,
    storageInfo,
  } = useSaveLoad();

  const handleSave = async () => {
    if (!currentResume || !saveTitle.trim()) return;

    try {
      await saveResume(currentResume, saveTitle.trim());
      setSaveTitle('');
      setOpen(false);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleLoad = async (resumeId: string) => {
    try {
      const resumeData = await loadResume(resumeId);
      if (resumeData) {
        onLoad(resumeData);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(resumeId);
    }
  };

  const handleExport = () => {
    if (currentResume) {
      exportResume(currentResume);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const resumeData = await importResume(file);
      if (resumeData) {
        onLoad(resumeData);
        setOpen(false);
      } else {
        alert('Failed to import resume. Please check the file format.');
      }
    } catch (error) {
      console.error('Error importing resume:', error);
      alert('Error importing resume. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Save className="w-4 h-4 mr-2" />
      Save / Load
    </Button>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Save & Load Resume</DialogTitle>
            <DialogDescription>
              Save your current resume or load a previously saved version.
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex space-x-2 border-b">
            <Button
              variant={activeTab === 'save' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('save')}
              className="rounded-b-none"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant={activeTab === 'load' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('load')}
              className="rounded-b-none"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Load
            </Button>
          </div>

          <div className="space-y-4">
            {activeTab === 'save' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="save-title" className="text-sm font-medium">
                    Resume Title *
                  </Label>
                  <Input
                    id="save-title"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder={`Resume ${new Date().toLocaleDateString()}`}
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    disabled={!saveTitle.trim() || isSaving}
                    className="flex-1"
                  >
                    {isSaving ? 'Saving...' : 'Save Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    disabled={!currentResume}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Storage: {storageInfo.totalResumes} resumes, {storageInfo.storageSize}</p>
                </div>
              </div>
            )}

            {activeTab === 'load' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Saved Resumes</h4>
                  <div className="flex space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[300px]">
                  {savedResumes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No saved resumes yet</p>
                      <p className="text-sm">Save your current resume to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedResumes.map((resume) => (
                        <div
                          key={resume.id}
                          className={`p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            currentResumeId === resume.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{resume.title}</h5>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(resume.lastModified), { addSuffix: true })}
                                {resume.isAutoSave && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Auto-saved
                                  </Badge>
                                )}
                                {currentResumeId === resume.id && (
                                  <Badge variant="default" className="ml-2 text-xs">
                                    Current
                                  </Badge>
                                )}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLoad(resume.id)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                              >
                                <FolderOpen className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(resume.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
