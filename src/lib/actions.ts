'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, desc, and } from 'drizzle-orm';
import { db, users, resumes, templates, type User, type Resume, type Template } from '@/lib/db';
import { 
  userSchema, 
  resumeSchema
} from '@/lib/db/schema';
import { stackServerApp } from '@/stack';

// Helper function to get authenticated user
async function getAuthenticatedUser(): Promise<User> {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    throw new Error('Unauthorized');
  }

  // Get user from database
  const dbUsers = await db
    .select()
    .from(users)
    .where(eq(users.stackId, stackUser.id))
    .limit(1);

  if (dbUsers.length === 0) {
    throw new Error('User not found in database');
  }

  return dbUsers[0];
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// USER ACTIONS

export async function createOrUpdateUser(stackUser: {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
  profileImageUrl: string | null;
}): Promise<User> {
  try {
    const validatedData = userSchema.parse({
      stackId: stackUser.id,
      email: stackUser.primaryEmail || '',
      name: stackUser.displayName || 'Anonymous User',
      avatar: stackUser.profileImageUrl,
    });

    // Check if user exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.stackId, stackUser.id))
      .limit(1);

    if (existingUsers.length > 0) {
      // Update existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          email: validatedData.email,
          name: validatedData.name,
          avatar: validatedData.avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.stackId, stackUser.id))
        .returning();

      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values(validatedData)
        .returning();

      return newUser;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw new Error('Failed to create or update user');
  }
}

// TEMPLATE ACTIONS

export async function getTemplates(): Promise<Template[]> {
  try {
    const allTemplates = await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(templates.name);

    return allTemplates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Failed to fetch templates');
  }
}

export async function getTemplateById(templateId: string): Promise<Template | null> {
  try {
    const templateList = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    return templateList.length > 0 ? templateList[0] : null;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw new Error('Failed to fetch template');
  }
}

// RESUME ACTIONS

export async function getUserResumes(): Promise<Resume[]> {
  try {
    const user = await getAuthenticatedUser();

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, user.id))
      .orderBy(desc(resumes.updatedAt));

    return userResumes;
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    throw new Error('Failed to fetch resumes');
  }
}

export async function getResumeById(resumeId: string): Promise<Resume | null> {
  try {
    const user = await getAuthenticatedUser();

    const resumeList = await db
      .select()
      .from(resumes)
      .where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, user.id)
      ))
      .limit(1);

    return resumeList.length > 0 ? resumeList[0] : null;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw new Error('Failed to fetch resume');
  }
}

export async function createResume(data: {
  title: string;
  templateId: string;
  content?: Record<string, unknown>;
}): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  try {
    const user = await getAuthenticatedUser();

    // Validate input
    const validatedData = resumeSchema.parse(data);

    // Verify template exists
    const template = await getTemplateById(validatedData.templateId);
    if (!template) {
      return { success: false, error: 'Template not found' };
    }

    // Create resume
    const [newResume] = await db
      .insert(resumes)
      .values({
        title: validatedData.title,
        templateId: validatedData.templateId,
        userId: user.id,
        slug: generateSlug(validatedData.title),
        content: validatedData.content ? JSON.stringify(validatedData.content) : null,
        isPublic: validatedData.isPublic,
        isPublished: validatedData.isPublished,
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, resumeId: newResume.id };

  } catch (error) {
    console.error('Error creating resume:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create resume' };
  }
}

export async function updateResume(
  resumeId: string,
  data: Partial<{ title?: string; content?: Record<string, unknown>; isPublic?: boolean; isPublished?: boolean }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAuthenticatedUser();

    // Verify user owns the resume
    const existingResume = await getResumeById(resumeId);
    if (!existingResume) {
      return { success: false, error: 'Resume not found' };
    }

    // Update resume
    await db
      .update(resumes)
      .set({
        ...data,
        content: data.content ? JSON.stringify(data.content) : undefined,
        updatedAt: new Date(),
      })
      .where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, user.id)
      ));

    revalidatePath('/dashboard');
    revalidatePath(`/editor/${resumeId}`);
    return { success: true };

  } catch (error) {
    console.error('Error updating resume:', error);
    return { success: false, error: 'Failed to update resume' };
  }
}

export async function deleteResume(resumeId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAuthenticatedUser();

    // Verify user owns the resume
    const existingResume = await getResumeById(resumeId);
    if (!existingResume) {
      return { success: false, error: 'Resume not found' };
    }

    // Delete resume
    await db
      .delete(resumes)
      .where(and(
        eq(resumes.id, resumeId),
        eq(resumes.userId, user.id)
      ));

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Error deleting resume:', error);
    return { success: false, error: 'Failed to delete resume' };
  }
}

export async function duplicateResume(resumeId: string): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  try {
    const user = await getAuthenticatedUser();

    // Get original resume
    const originalResume = await getResumeById(resumeId);
    if (!originalResume) {
      return { success: false, error: 'Resume not found' };
    }

    // Create duplicate
    const [duplicatedResume] = await db
      .insert(resumes)
      .values({
        title: `${originalResume.title} (Copy)`,
        templateId: originalResume.templateId,
        userId: user.id,
        slug: generateSlug(`${originalResume.title} (Copy)`),
        content: originalResume.content,
        isPublic: false, // Duplicates are private by default
        isPublished: false,
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, resumeId: duplicatedResume.id };

  } catch (error) {
    console.error('Error duplicating resume:', error);
    return { success: false, error: 'Failed to duplicate resume' };
  }
}

// NAVIGATION ACTIONS

export async function redirectToEditor(resumeId: string) {
  redirect(`/editor/${resumeId}`);
}

export async function redirectToDashboard() {
  redirect('/dashboard');
}
