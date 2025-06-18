// Simple templates API
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDB();
    
    const allTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true));

    return NextResponse.json({
      success: true,
      templates: allTemplates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
