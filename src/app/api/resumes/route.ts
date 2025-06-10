// API routes for resume management with StackAuth integration
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { ResumeService } from '@/lib/db/resume-service';
import type { StackAuthUser } from '@/types/auth';
import type { User } from '@prisma/client';

export const GET = withAuth(async (request: NextRequest, user: StackAuthUser, dbUser: User) => {
  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get('id');

  if (resumeId) {
    // Get specific resume
    const resume = await ResumeService.getCompleteResume(resumeId, dbUser.id);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, resume });
  } else {
    // Get all resumes for current user
    const resumes = await ResumeService.getUserResumes(dbUser.id);

    return NextResponse.json({
      success: true,
      resumes: resumes.map(resume => ({
        id: resume.id,
        title: resume.title,
        template: resume.template.name.toLowerCase(),
        lastModified: formatLastModified(resume.updatedAt),
        status: resume.isPublished ? 'published' : 'draft',
        atsScore: 85, // TODO: Calculate actual ATS score
        views: 0, // TODO: Track views
        downloads: 0, // TODO: Track downloads
        favorite: false, // TODO: Add favorite field to schema
        createdAt: resume.createdAt.toISOString().split('T')[0],
        updatedAt: resume.updatedAt.toISOString().split('T')[0],
        tags: [], // TODO: Extract tags from resume content
      })),
    });
  }
});

export const POST = withAuth(async (request: NextRequest, user: StackAuthUser, dbUser: User) => {
  const body = await request.json();
  
  // Type assertion for request body
  const requestData = body as {
    title?: string;
    templateId?: string;
    data?: unknown;
    id?: string;
  };

  const { title, templateId, data } = requestData;

  if (title && templateId) {
    // Create new resume
    const resume = await ResumeService.createResume(dbUser.id, {
      title,
      templateId,
      resumeData: data,
    });

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId,
      },
    });
  } else if (data) {
    // Save/update existing resume data
    const { id: resumeId } = requestData;
    
    if (resumeId) {
      await ResumeService.updateResumeData(resumeId);
      return NextResponse.json({ success: true, id: resumeId });
    } else {
      return NextResponse.json({ error: 'Resume ID required for updates' }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
});

export const DELETE = withAuth(async (request: NextRequest, user: StackAuthUser, dbUser: User) => {
  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get('id');

  if (!resumeId) {
    return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
  }

  // Delete the resume
  await ResumeService.deleteResume(resumeId, dbUser.id);
  
  return NextResponse.json({ success: true });
});

function formatLastModified(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
}
