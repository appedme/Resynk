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
    console.log('📊 Fetching resumes for user:', dbUser.id);
    const resumes = await ResumeService.getUserResumes(dbUser.id);
    console.log('📄 Raw resumes from DB:', resumes.length);

    return NextResponse.json({
      success: true,
      resumes: resumes.map(resume => {
        console.log('🔄 Converting resume:', resume.id);
        return ResumeService.convertToSimpleFormat(resume);
      }),
    });
  }
});

export const POST = withAuth(async (request: NextRequest, user: StackAuthUser, dbUser: User) => {
  const body = await request.json();

  // Type assertion for request body
  const requestData = body as {
    title?: string;
    templateId?: string;
    data?: Record<string, unknown>;
    id?: string;
  };

  const { title, templateId, data, id } = requestData;

  if (title && templateId) {
    // Create new resume
    console.log('📝 Creating new resume:', {
      title,
      templateId,
      userId: dbUser.id,
      userEmail: dbUser.email
    });

    const resume = await ResumeService.createResume(dbUser.id, {
      title,
      templateId,
      resumeData: data,
    });

    console.log('✅ Resume created successfully:', {
      id: resume.id,
      title: resume.title,
      template: resume.template.name
    });

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        templateId: resume.templateId,
      },
    });
  } else if (id && data) {
    // Update existing resume data
    await ResumeService.updateResumeData(id, data);
    return NextResponse.json({ success: true, id });
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
