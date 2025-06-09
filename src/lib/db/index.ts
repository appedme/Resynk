import { Resume, ResumeData, Template, User } from '@/types/resume';
import { ApiResponse } from '@/types/common';

// Mock database - In production, this would connect to Cloudflare D1
class MockDatabase {
  private resumes: Resume[] = [];
  private templates: Template[] = [];
  private users: User[] = [];

  // Initialize with some mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock templates
    this.templates = [
      {
        id: 'modern_professional',
        name: 'Modern Professional',
        description: 'Clean and modern design perfect for corporate roles',
        category: 'professional',
        preview_url: '/templates/modern_professional_preview.png',
        thumbnail_url: '/templates/modern_professional_thumb.png',
        is_premium: false,
        popularity_score: 95,
        created_at: new Date('2024-01-01'),
      },
      {
        id: 'creative_designer',
        name: 'Creative Designer',
        description: 'Showcase your creativity with this vibrant template',
        category: 'creative',
        preview_url: '/templates/creative_designer_preview.png',
        thumbnail_url: '/templates/creative_designer_thumb.png',
        is_premium: true,
        popularity_score: 88,
        created_at: new Date('2024-01-15'),
      },
      {
        id: 'minimal_clean',
        name: 'Minimal Clean',
        description: 'Simple and elegant design that focuses on content',
        category: 'minimal',
        preview_url: '/templates/minimal_clean_preview.png',
        thumbnail_url: '/templates/minimal_clean_thumb.png',
        is_premium: false,
        popularity_score: 92,
        created_at: new Date('2024-02-01'),
      },
      {
        id: 'tech_modern',
        name: 'Tech Modern',
        description: 'Modern template optimized for tech professionals',
        category: 'modern',
        industry: 'Technology',
        preview_url: '/templates/tech_modern_preview.png',
        thumbnail_url: '/templates/tech_modern_thumb.png',
        is_premium: false,
        popularity_score: 90,
        created_at: new Date('2024-02-15'),
      },
    ];
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return this.templates;
  }

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templates.find(t => t.id === id) || null;
  }

  // Resume methods
  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return this.resumes.filter(r => r.user_id === userId);
  }

  async getResumeById(id: string): Promise<Resume | null> {
    return this.resumes.find(r => r.id === id) || null;
  }

  async createResume(resume: Omit<Resume, 'id' | 'created_at' | 'updated_at'>): Promise<Resume> {
    const newResume: Resume = {
      ...resume,
      id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.resumes.push(newResume);
    return newResume;
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | null> {
    const index = this.resumes.findIndex(r => r.id === id);
    if (index === -1) return null;

    this.resumes[index] = {
      ...this.resumes[index],
      ...updates,
      updated_at: new Date(),
    };
    return this.resumes[index];
  }

  async deleteResume(id: string): Promise<boolean> {
    const index = this.resumes.findIndex(r => r.id === id);
    if (index === -1) return false;

    this.resumes.splice(index, 1);
    return true;
  }

  // User methods
  async getUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}

// Export singleton instance
export const db = new MockDatabase();

// Utility functions for API responses
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(code: string, message: string, details?: any): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

// Default resume data generator
export function createDefaultResumeData(): ResumeData {
  return {
    personal: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    certifications: [],
    languages: [],
    custom_sections: [],
  };
}

// Generate unique IDs
export function generateId(prefix: string = ''): string {
  return `${prefix}${prefix ? '_' : ''}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
