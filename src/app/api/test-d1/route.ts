// Test D1 database connection
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { users, resumes, templates } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDB();

    // Test database queries
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resumeCount] = await db.select({ count: count() }).from(resumes);
    const [templateCount] = await db.select({ count: count() }).from(templates);

    // Get templates
    const allTemplates = await db.select().from(templates);

    return NextResponse.json({
      success: true,
      counts: {
        users: userCount.count,
        resumes: resumeCount.count,
        templates: templateCount.count,
      },
      templates: allTemplates,
      message: 'D1 database connected successfully!',
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 
      { status: 500 }
    );
  }
}
