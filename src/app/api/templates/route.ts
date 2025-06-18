import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { templates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDB();
    
    // Seed templates if they don't exist
    const existingTemplates = await db.select().from(templates);
    
    if (existingTemplates.length === 0) {
      // Insert default templates
      await db.insert(templates).values([
        {
          id: 'modern',
          name: 'Modern',
          description: 'A clean, modern design perfect for tech professionals',
          category: 'professional',
        },
        {
          id: 'professional',
          name: 'Professional', 
          description: 'Classic professional template for traditional industries',
          category: 'professional',
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Eye-catching design for creative professionals',
          category: 'creative',
        },
      ]);
    }

    const allTemplates = await db.select().from(templates).where(eq(templates.isPublic, true));
    return NextResponse.json({ success: true, templates: allTemplates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
