// React hook for Save/Load functionality
"use client";

import { useState, useEffect, useCallback } from 'react';
import SaveLoadService, { type SavedResume } from '@/lib/save-load-service';
import type { ResumeData } from '@/types/resume';

export function useSaveLoad() {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ totalResumes: number; storageSize: string }>({
    totalResumes: 0,
    storageSize: '0 KB',
  });

  // Load saved resumes on mount
  useEffect(() => {
    const loadResumes = async () => {
      const resumes = await SaveLoadService.getAllResumes();
      setSavedResumes(resumes);
      setCurrentResumeId(SaveLoadService.getCurrentResumeId());
      
      // Load storage info
      const info = await SaveLoadService.getStorageInfo();
      setStorageInfo(info);
    };
    loadResumes();
  }, []);

  const saveResume = useCallback(async (resumeData: ResumeData, title?: string): Promise<string> => {
    setIsSaving(true);
    try {
      const resumeId = await SaveLoadService.saveResume(resumeData, title);
      const resumes = await SaveLoadService.getAllResumes();
      setSavedResumes(resumes);
      setCurrentResumeId(resumeId);
      
      // Update storage info
      const info = await SaveLoadService.getStorageInfo();
      setStorageInfo(info);
      
      return resumeId;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadResume = useCallback(async (resumeId: string): Promise<ResumeData | null> => {
    setIsLoading(true);
    try {
      const resumeData = await SaveLoadService.loadResume(resumeId);
      if (resumeData) {
        SaveLoadService.setCurrentResumeId(resumeId);
        setCurrentResumeId(resumeId);
      }
      return resumeData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteResume = useCallback(async (resumeId: string): Promise<boolean> => {
    const success = await SaveLoadService.deleteResume(resumeId);
    if (success) {
      const resumes = await SaveLoadService.getAllResumes();
      setSavedResumes(resumes);
      if (currentResumeId === resumeId) {
        setCurrentResumeId(null);
      }
      
      // Update storage info
      const info = await SaveLoadService.getStorageInfo();
      setStorageInfo(info);
    }
    return success;
  }, [currentResumeId]);

  const autoSave = useCallback(async (resumeData: ResumeData): Promise<string> => {
    return SaveLoadService.autoSave(resumeData);
  }, []);

  const exportResume = useCallback((resumeData: ResumeData) => {
    SaveLoadService.exportResume(resumeData);
  }, []);

  const importResume = useCallback(async (file: File): Promise<ResumeData | null> => {
    setIsLoading(true);
    try {
      return await SaveLoadService.importResume(file);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCurrentResume = useCallback(async (): Promise<ResumeData | null> => {
    return SaveLoadService.loadCurrentResume();
  }, []);

  return {
    savedResumes,
    currentResumeId,
    isLoading,
    isSaving,
    saveResume,
    loadResume,
    deleteResume,
    autoSave,
    exportResume,
    importResume,
    loadCurrentResume,
    storageInfo,
  };
}
