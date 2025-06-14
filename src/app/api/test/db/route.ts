// Simple test to check database operations
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');

    // Test database connection
    const userCount = await prisma.user.count();
    const resumeCount = await prisma.resume.count();
    const templateCount = await prisma.template.count();

    console.log('📊 Database counts:', { userCount, resumeCount, templateCount });

    // Get some sample data
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    const templates = await prisma.template.findMany({
      select: { id: true, name: true, category: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          users: userCount,
          resumes: resumeCount,
          templates: templateCount
        },
        recentUsers,
        templates,
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
