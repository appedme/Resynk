// API routes for resume management
import { NextRequest, NextResponse } from 'next/server';
import type { ResumeData } from '@/types/resume';

interface SavedResume {
    id: string;
    title: string;
    data: ResumeData;
    lastModified: string;
    isAutoSave: boolean;
}

interface SaveResumeRequest {
    title?: string;
    data: ResumeData;
    isAutoSave?: boolean;
}

// Mock database - in production, replace with actual database
let resumes: SavedResume[] = [];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const resumeId = searchParams.get('id');

        if (resumeId) {
            // Get specific resume
            const resume = resumes.find(r => r.id === resumeId);
            if (!resume) {
                return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: resume });
        } else {
            // Get all resumes for current user
            return NextResponse.json({ success: true, data: resumes.slice(0, 50) }); // Limit to 50 most recent
        }
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch resumes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json() as SaveResumeRequest;

        // Generate ID if not provided
        const resumeId = crypto.randomUUID();

        const savedResume: SavedResume = {
            id: resumeId,
            title: requestData.title || `Resume ${new Date().toLocaleDateString()}`,
            data: requestData.data,
            lastModified: new Date().toISOString(),
            isAutoSave: requestData.isAutoSave || false,
        };

        // Update existing or add new
        const existingIndex = resumes.findIndex(r => r.id === resumeId);
        if (existingIndex >= 0) {
            resumes[existingIndex] = savedResume;
        } else {
            resumes.push(savedResume);
        }

        // Keep only last 50 resumes
        resumes = resumes
            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .slice(0, 50);

        return NextResponse.json({ success: true, data: { id: resumeId } });
    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json({ success: false, error: 'Failed to save resume' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const resumeId = searchParams.get('id');

        if (!resumeId) {
            return NextResponse.json({ success: false, error: 'Resume ID required' }, { status: 400 });
        }

        resumes = resumes.filter(r => r.id !== resumeId);
        return NextResponse.json({ success: true, data: true });
    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete resume' }, { status: 500 });
    }
}
