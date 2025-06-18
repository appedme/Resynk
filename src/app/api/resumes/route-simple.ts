import { NextRequest, NextResponse } from 'next/server';
import { db, resumes, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { stackServerApp } from '@/stack';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database
    const dbUser = await db.select().from(users).where(eq(users.stackId, user.id)).limit(1);
    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (resumeId) {
      // Get specific resume
      const resume = await db
        .select()
        .from(resumes)
        .where(and(eq(resumes.id, resumeId), eq(resumes.userId, dbUser[0].id)))
        .limit(1);

      if (resume.length === 0) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, resume: resume[0] });
    } else {
      // Get all resumes for user
      const userResumes = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, dbUser[0].id));

      return NextResponse.json({ success: true, resumes: userResumes });
    }
  } catch (error) {
    console.error('Error in GET /api/resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user in database
    let dbUser = await db.select().from(users).where(eq(users.stackId, user.id)).limit(1);
    
    if (dbUser.length === 0) {
      // Create user
      const newUser = await db.insert(users).values({
        stackId: user.id,
        email: user.primaryEmail || '',
        name: user.displayName || 'Anonymous',
        avatar: user.profileImageUrl,
      }).returning();
      dbUser = newUser;
    }

    const body = await request.json() as {
      title?: string;
      templateId?: string;
      content?: unknown;
      id?: string;
    };
    const { title, templateId, content, id } = body;

    if (id) {
      // Update existing resume
      await db
        .update(resumes)
        .set({ 
          content: JSON.stringify(content),
          updatedAt: new Date()
        })
        .where(and(eq(resumes.id, id), eq(resumes.userId, dbUser[0].id)));

      return NextResponse.json({ success: true, id });
    } else if (title && templateId) {
      // Create new resume
      const newResume = await db.insert(resumes).values({
        userId: dbUser[0].id,
        templateId,
        title,
        content: content ? JSON.stringify(content) : null,
      }).returning();

      return NextResponse.json({ 
        success: true, 
        resume: { id: newResume[0].id, title, templateId } 
      });
    } else {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/resumes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
