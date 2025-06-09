// Save/Load Service for Resume Data with Backend Integration
"use client";

import type { ResumeData } from '@/types/resume';

interface SavedResume {
    id: string;
    title: string;
    data: ResumeData;
    lastModified: Date;
    isAutoSave: boolean;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

class SaveLoadService {
    private static readonly STORAGE_KEY = 'resync_resumes';
    private static readonly CURRENT_RESUME_KEY = 'resync_current_resume_id';
    private static readonly API_BASE = '/api/resumes';

    // Generic API call method with fallback to localStorage
    private static async apiCall<T = unknown>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data as ApiResponse<T>;
        } catch (error) {
            console.warn('API call failed, falling back to localStorage:', error);
            return this.fallbackToLocalStorage<T>(url, options);
        }
    }

    // Fallback to localStorage when API is unavailable
    private static fallbackToLocalStorage<T = unknown>(url: string, options: RequestInit): ApiResponse<T> {
        const method = options.method || 'GET';

        if (url.includes('/api/resumes') && method === 'GET') {
            return { success: true, data: this.getAllResumesFromStorage() as T };
        }

        // For other operations, just return a basic response
        return { success: true, data: undefined };
    }

    // Get all saved resumes (API-first with localStorage fallback)
    static async getAllResumes(): Promise<SavedResume[]> {
        try {
            const response = await this.apiCall(this.API_BASE);
            return (response.data as SavedResume[]) || [];
        } catch (error) {
            console.warn('Failed to get resumes from API:', error);
            return this.getAllResumesFromStorage();
        }
    }

    // Get resumes from localStorage
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

    // Save a resume (API-first with localStorage fallback)
    static async saveResume(resumeData: ResumeData, title?: string, isAutoSave: boolean = false): Promise<string> {
        try {
            const payload = {
                title: title || `Resume ${new Date().toLocaleDateString()}`,
                data: resumeData,
                isAutoSave,
            };

            const response = await this.apiCall(this.API_BASE, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            const resumeId = (response.data as { id: string })?.id || crypto.randomUUID();

            // Also save to localStorage as backup
            this.saveResumeToStorage(resumeData, title, isAutoSave);

            if (!isAutoSave) {
                this.setCurrentResumeId(resumeId);
            }

            return resumeId;
        } catch (error) {
            console.warn('Failed to save resume to API:', error);
            return this.saveResumeToStorage(resumeData, title, isAutoSave);
        }
    }

    // Save resume to localStorage
    private static saveResumeToStorage(resumeData: ResumeData, title?: string, isAutoSave: boolean = false): string {
        if (typeof window === 'undefined') return '';

        try {
            const resumes = this.getAllResumesFromStorage();
            const resumeId = crypto.randomUUID();

            const savedResume: SavedResume = {
                id: resumeId,
                title: title || `Resume ${new Date().toLocaleDateString()}`,
                data: resumeData,
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

    // Load a specific resume
    static async loadResume(resumeId: string): Promise<ResumeData | null> {
        try {
            const response = await this.apiCall(`${this.API_BASE}/${resumeId}`);
            return (response.data as ResumeData) || null;
        } catch (error) {
            console.warn('Failed to load resume from API:', error);
            // Fallback to localStorage
            const resumes = this.getAllResumesFromStorage();
            const resume = resumes.find(r => r.id === resumeId);
            return resume ? resume.data : null;
        }
    }

    // Delete a resume
    static async deleteResume(resumeId: string): Promise<boolean> {
        try {
            await this.apiCall(`${this.API_BASE}/${resumeId}`, {
                method: 'DELETE',
            });

            // Also delete from localStorage
            const resumes = this.getAllResumesFromStorage();
            const filteredResumes = resumes.filter(r => r.id !== resumeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResumes));

            return true;
        } catch (error) {
            console.warn('Failed to delete resume from API:', error);
            const resumes = this.getAllResumesFromStorage();
            const filteredResumes = resumes.filter(r => r.id !== resumeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResumes));
            return true;
        }
    }

    // Auto-save functionality
    static async autoSave(resumeData: ResumeData): Promise<string> {
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
    static async loadCurrentResume(): Promise<ResumeData | null> {
        const currentId = this.getCurrentResumeId();
        return currentId ? this.loadResume(currentId) : null;
    }

    // Export resume data
    static exportResume(resumeData: ResumeData): void {
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
    static async importResume(file: File): Promise<ResumeData | null> {
        if (typeof window === 'undefined') return null;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // Validate import data structure
            if (importData.resume && typeof importData.resume === 'object') {
                const resumeData = importData.resume as ResumeData;

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
    static async getStorageInfo(): Promise<{ totalResumes: number; storageSize: string }> {
        if (typeof window === 'undefined') return { totalResumes: 0, storageSize: '0 KB' };

        try {
            const resumes = await this.getAllResumes();
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
export type { SavedResume, ApiResponse };
