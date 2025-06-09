// Simplified Save/Load Service for Resume Data
"use client";

interface SavedResume {
    id: string;
    title: string;
    data: any;
    lastModified: Date;
    isAutoSave: boolean;
}

class SaveLoadService {
    private static readonly STORAGE_KEY = 'resync_resumes';
    private static readonly CURRENT_RESUME_KEY = 'resync_current_resume_id';

    // Get all saved resumes from localStorage
    static getAllResumes(): SavedResume[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading resumes:', error);
            return [];
        }
    }

    // Save a resume to localStorage
    static saveResume(resumeData: any, title?: string, isAutoSave: boolean = false): string {
        if (typeof window === 'undefined') return '';

        try {
            const resumes = this.getAllResumes();
            const resumeId = resumeData.id || crypto.randomUUID();

            const savedResume: SavedResume = {
                id: resumeId,
                title: title || `Resume ${new Date().toLocaleDateString()}`,
                data: { ...resumeData, id: resumeId },
                lastModified: new Date(),
                isAutoSave,
            };

            const existingIndex = resumes.findIndex(r => r.id === resumeId);
            if (existingIndex >= 0) {
                resumes[existingIndex] = savedResume;
            } else {
                resumes.push(savedResume);
            }

            // Keep only last 50 resumes
            const sortedResumes = resumes
                .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .slice(0, 50);

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedResumes));

            if (!isAutoSave) {
                this.setCurrentResumeId(resumeId);
            }

            return resumeId;
        } catch (error) {
            console.error('Error saving resume:', error);
            return '';
        }
    }

    // Load a specific resume
    static loadResume(resumeId: string): any | null {
        if (typeof window === 'undefined') return null;

        try {
            const resumes = this.getAllResumes();
            const resume = resumes.find(r => r.id === resumeId);
            return resume ? resume.data : null;
        } catch (error) {
            console.error('Error loading resume:', error);
            return null;
        }
    }

    // Delete a resume
    static deleteResume(resumeId: string): boolean {
        if (typeof window === 'undefined') return false;

        try {
            const resumes = this.getAllResumes();
            const filteredResumes = resumes.filter(r => r.id !== resumeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResumes));
            return true;
        } catch (error) {
            console.error('Error deleting resume:', error);
            return false;
        }
    }

    // Auto-save functionality
    static autoSave(resumeData: any): string {
        return this.saveResume(resumeData, 'Auto-saved Resume', true);
    }

    // Get current resume ID
    static getCurrentResumeId(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.CURRENT_RESUME_KEY);
    }

    // Set current resume ID
    static setCurrentResumeId(resumeId: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.CURRENT_RESUME_KEY, resumeId);
    }

    // Load current resume
    static loadCurrentResume(): any | null {
        const currentId = this.getCurrentResumeId();
        return currentId ? this.loadResume(currentId) : null;
    }

    // Export resume data
    static exportResume(resumeData: any): void {
        if (typeof window === 'undefined') return;

        try {
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                resume: resumeData,
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resume-backup-${new Date().toISOString().split('T')[0]}.json`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting resume:', error);
        }
    }

    // Import resume data
    static async importResume(file: File): Promise<any | null> {
        if (typeof window === 'undefined') return null;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // Validate import data structure
            if (importData.resume && typeof importData.resume === 'object') {
                const resumeData = importData.resume;
                // Generate new ID for imported resume
                resumeData.id = crypto.randomUUID();
                resumeData.metadata = {
                    ...resumeData.metadata,
                    lastModified: new Date(),
                    version: (resumeData.metadata?.version || 0) + 1,
                };

                return resumeData;
            }

            throw new Error('Invalid resume file format');
        } catch (error) {
            console.error('Error importing resume:', error);
            return null;
        }
    }

    // Clear all data (for debugging)
    static clearAllData(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.CURRENT_RESUME_KEY);
    }

    // Get storage info
    static getStorageInfo(): { totalResumes: number; storageSize: string } {
        if (typeof window === 'undefined') return { totalResumes: 0, storageSize: '0 KB' };

        try {
            const resumes = this.getAllResumes();
            const storageData = localStorage.getItem(this.STORAGE_KEY) || '';
            const sizeInBytes = new Blob([storageData]).size;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            return {
                totalResumes: resumes.length,
                storageSize: `${sizeInKB} KB`,
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { totalResumes: 0, storageSize: '0 KB' };
        }
    }
}

export default SaveLoadService;

// Hook for using save/load functionality
import { useState, useEffect, useCallback } from 'react';

export function useSaveLoad() {
    const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
    const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load saved resumes on mount
    useEffect(() => {
        const resumes = SaveLoadService.getAllResumes();
        setSavedResumes(resumes);
        setCurrentResumeId(SaveLoadService.getCurrentResumeId());
    }, []);

    const saveResume = useCallback(async (resumeData: any, title?: string): Promise<string> => {
        setIsSaving(true);
        try {
            const resumeId = SaveLoadService.saveResume(resumeData, title);
            const resumes = SaveLoadService.getAllResumes();
            setSavedResumes(resumes);
            setCurrentResumeId(resumeId);
            return resumeId;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const loadResume = useCallback(async (resumeId: string): Promise<any | null> => {
        setIsLoading(true);
        try {
            const resumeData = SaveLoadService.loadResume(resumeId);
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
        const success = SaveLoadService.deleteResume(resumeId);
        if (success) {
            const resumes = SaveLoadService.getAllResumes();
            setSavedResumes(resumes);
            if (currentResumeId === resumeId) {
                setCurrentResumeId(null);
            }
        }
        return success;
    }, [currentResumeId]);

    const autoSave = useCallback(async (resumeData: any): Promise<string> => {
        return SaveLoadService.autoSave(resumeData);
    }, []);

    const exportResume = useCallback((resumeData: any) => {
        SaveLoadService.exportResume(resumeData);
    }, []);

    const importResume = useCallback(async (file: File): Promise<any | null> => {
        setIsLoading(true);
        try {
            return await SaveLoadService.importResume(file);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadCurrentResume = useCallback(async (): Promise<any | null> => {
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
        storageInfo: SaveLoadService.getStorageInfo(),
    };
}
