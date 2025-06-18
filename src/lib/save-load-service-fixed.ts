// Save/Load Service for Resume Data with Backend Integration
"use client";

interface SavedResume {
    id: string;
    title: string;
    data: any; // Resume data
    lastModified: Date;
    isAutoSave: boolean;
    userId?: string;
}

class SaveLoadService {
    private static readonly STORAGE_KEY = 'resync_resumes';
    private static readonly CURRENT_RESUME_KEY = 'resync_current_resume_id';
    private static readonly API_BASE = '/api/resumes';

    // Backend API calls
    private static async apiCall(url: string, options: RequestInit = {}): Promise<any> {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Get all saved resumes (API with localStorage fallback)
    static async getAllResumes(): Promise<SavedResume[]> {
        try {
            return await this.apiCall(this.API_BASE);
        } catch {
            return this.getAllResumesFromStorage();
        }
    }

    // Get all resumes from localStorage (fallback)
    private static getAllResumesFromStorage(): SavedResume[] {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading resumes from storage:', error);
            return [];
        }
    }

    // Save a resume (API with localStorage fallback)
    static async saveResume(resumeData: any, title?: string, isAutoSave: boolean = false): Promise<string> {
        const payload = {
            ...resumeData,
            title: title || `Resume ${new Date().toLocaleDateString()}`,
            isAutoSave,
        };

        try {
            const result = await this.apiCall(this.API_BASE, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            // Also save to localStorage as backup
            this.saveResumeToStorage(payload, title, isAutoSave);

            if (!isAutoSave) {
                this.setCurrentResumeId(result.id);
            }

            return result.id;
        } catch (error: any) {
            // Check if it's an authentication error
            if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                // If not auto-save, throw the error to be handled by the UI
                if (!isAutoSave) {
                    throw new Error('AUTHENTICATION_REQUIRED');
                }
            }
            
            console.warn('API save failed, falling back to localStorage:', error);
            // Fallback to localStorage
            return this.saveResumeToStorage(payload, title, isAutoSave);
        }
    }

    // Save resume to localStorage (fallback)
    private static saveResumeToStorage(resumeData: any, title?: string, isAutoSave: boolean = false): string {
        if (typeof window === 'undefined') return '';

        try {
            const resumes = this.getAllResumesFromStorage();
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
            console.error('Error saving resume to storage:', error);
            return '';
        }
    }

    // Load a specific resume (API with localStorage fallback)
    static async loadResume(resumeId: string): Promise<any | null> {
        try {
            return await this.apiCall(`${this.API_BASE}?id=${resumeId}`);
        } catch {
            // Fallback to localStorage
            const resumes = this.getAllResumesFromStorage();
            const resume = resumes.find(r => r.id === resumeId);
            return resume ? resume.data : null;
        }
    }

    // Delete a resume (API with localStorage fallback)
    static async deleteResume(resumeId: string): Promise<boolean> {
        try {
            await this.apiCall(`${this.API_BASE}?id=${resumeId}`, { method: 'DELETE' });
            // Also remove from localStorage
            this.deleteResumeFromStorage(resumeId);
            return true;
        } catch {
            // Fallback to localStorage
            return this.deleteResumeFromStorage(resumeId);
        }
    }

    // Delete resume from localStorage (fallback)
    private static deleteResumeFromStorage(resumeId: string): boolean {
        if (typeof window === 'undefined') return false;

        try {
            const resumes = this.getAllResumesFromStorage();
            const filteredResumes = resumes.filter(r => r.id !== resumeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResumes));
            return true;
        } catch (error) {
            console.error('Error deleting resume from storage:', error);
            return false;
        }
    }

    // Auto-save functionality
    static async autoSave(resumeData: any): Promise<string> {
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
    static async loadCurrentResume(): Promise<any | null> {
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
            const resumes = this.getAllResumesFromStorage();
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
        const loadResumes = async () => {
            setIsLoading(true);
            try {
                const resumes = await SaveLoadService.getAllResumes();
                setSavedResumes(resumes);
                setCurrentResumeId(SaveLoadService.getCurrentResumeId());
            } catch (error) {
                console.error('Error loading resumes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadResumes();
    }, []);

    const saveResume = useCallback(async (resumeData: any, title?: string): Promise<string> => {
        setIsSaving(true);
        try {
            const resumeId = await SaveLoadService.saveResume(resumeData, title);
            const resumes = await SaveLoadService.getAllResumes();
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
        }
        return success;
    }, [currentResumeId]);

    const autoSave = useCallback(async (resumeData: any): Promise<string> => {
        return await SaveLoadService.autoSave(resumeData);
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
        return await SaveLoadService.loadCurrentResume();
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
