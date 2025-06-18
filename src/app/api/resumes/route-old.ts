// API routes for resume management with server actions
import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getUserResumes, getResumeById, createResume, updateResume } from '@/lib/actions';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (resumeId) {
      // Get specific resume
      const resume = await getResumeById(resumeId);
      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      // Parse content if it's a JSON string
      const content = resume.content ? JSON.parse(resume.content) : null;

      return NextResponse.json({ 
        success: true, 
        resume: {
          ...resume,
          content
        }
      });
    } else {
      // Get all resumes for current user
      const resumes = await getUserResumes();
      return NextResponse.json({
        success: true,
        resumes: resumes.map(resume => ({
          id: resume.id,
          title: resume.title,
          templateId: resume.templateId,
          isPublic: resume.isPublic,
          isPublished: resume.isPublished,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        })),
      });
    }
  } catch (error) {
    console.error('Error in GET /api/resumes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, templateId, content, id } = body as {
      title?: string;
      templateId?: string;
      content?: Record<string, unknown>;
      id?: string;
    };

    if (id) {
      // Update existing resume
      const result = await updateResume(id, { content });
      if (result.success) {
        return NextResponse.json({ success: true, id });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } else if (title && templateId) {
      // Create new resume
      const result = await createResume({ title, templateId, content });
      if (result.success) {
        return NextResponse.json({
          success: true,
          resume: { id: result.resumeId, title, templateId },
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/resumes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
