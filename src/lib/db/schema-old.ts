import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

// Users table for StackAuth integration
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  stackId: text('stack_id').notNull().unique(), // StackAuth user ID
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  stackIdIdx: index('users_stack_id_idx').on(table.stackId),
}));

// Templates table for resume templates
export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category', { 
    enum: ['professional', 'creative', 'minimal', 'modern', 'academic'] 
  }).notNull().default('professional'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(true),
  isPremium: integer('is_premium', { mode: 'boolean' }).notNull().default(false),
  previewUrl: text('preview_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  categoryIdx: index('templates_category_idx').on(table.category),
  publicIdx: index('templates_public_idx').on(table.isPublic),
}));

// Resumes table - main entity with JSON content
export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => templates.id),
  title: text('title').notNull(),
  slug: text('slug').unique(),
  content: text('content'), // JSON string containing all resume data
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index('resumes_user_id_idx').on(table.userId),
  templateIdIdx: index('resumes_template_id_idx').on(table.templateId),
  slugIdx: index('resumes_slug_idx').on(table.slug),
  createdAtIdx: index('resumes_created_at_idx').on(table.createdAt),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
