// Simple API routes for resume management
import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getDB } from '@/lib/db';
import { resumes, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDB();
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.stackId, user.id))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = dbUsers[0];

    if (resumeId) {
      // Get specific resume
      const userResumes = await db
        .select()
        .from(resumes)
        .where(and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, dbUser.id)
        ))
        .limit(1);

      if (userResumes.length === 0) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      const resume = userResumes[0];
      const content = resume.content ? JSON.parse(resume.content) : null;

      return NextResponse.json({ 
        success: true, 
        resume: { ...resume, content }
      });
    } else {
      // Get all resumes for current user
      const userResumes = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, dbUser.id));

      return NextResponse.json({
        success: true,
        resumes: userResumes,
      });
    }
  } catch (error) {
    console.error('Error in GET /api/resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDB();
    const body = await request.json() as {
      title?: string;
      templateId?: string;
      content?: Record<string, unknown>;
      id?: string;
    };
    const { title, templateId, content, id } = body;

    // Get user from database
    const dbUsers = await db
      .select()
      .from(users)
      .where(eq(users.stackId, user.id))
      .limit(1);

    if (dbUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = dbUsers[0];

    if (id) {
      // Update existing resume
      await db
        .update(resumes)
        .set({
          content: content ? JSON.stringify(content) : null,
          updatedAt: new Date(),
        })
        .where(and(eq(resumes.id, id), eq(resumes.userId, dbUser.id)));

      return NextResponse.json({ success: true, id });
    } else if (title && templateId) {
      // Create new resume
      const [newResume] = await db
        .insert(resumes)
        .values({
          title,
          templateId,
          userId: dbUser.id,
          content: content ? JSON.stringify(content) : null,
        })
        .returning();

      return NextResponse.json({
        success: true,
        resume: { id: newResume.id, title, templateId },
      });
    } else {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
