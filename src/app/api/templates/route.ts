import { NextResponse } from 'next/server';
import { TemplateService } from '@/lib/db/template-service';

export async function GET() {
  try {
    const templates = await TemplateService.getPublicTemplates();
    
    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
