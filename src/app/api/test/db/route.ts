// Simple test to check database operations
import { NextResponse } from 'next/server';
import { db, users, resumes, templates } from '@/lib/db';
import { count, desc } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');

    // Test database connection by counting records
    const [userCount] = await db.select({ count: count() }).from(users);
    const [resumeCount] = await db.select({ count: count() }).from(resumes);
    const [templateCount] = await db.select({ count: count() }).from(templates);

    console.log('📊 Database counts:', { 
      users: userCount.count, 
      resumes: resumeCount.count, 
      templates: templateCount.count 
    });

    // Get some sample data
    const recentUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(3);

    const allTemplates = await db
      .select({
        id: templates.id,
        name: templates.name,
        category: templates.category
      })
      .from(templates);

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          users: userCount.count,
          resumes: resumeCount.count,
          templates: templateCount.count
        },
        recentUsers,
        templates: allTemplates,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
