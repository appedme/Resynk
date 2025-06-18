# Cloudflare D1 Migration Guide

## 📋 Overview

This guide covers the complete migration from Prisma/MySQL to Drizzle ORM with Cloudflare D1, following best practices from the [Cloudflare D1 + Drizzle Setup Guide](https://dev.to/sh20raj/cloudflare-d1-drizzle-orm-setup-guide-3oap).

## 🎯 Why Drizzle + D1?

### Benefits
- **Serverless-First**: Perfect for Cloudflare Workers/Pages
- **Type Safety**: Better TypeScript support than Prisma
- **Performance**: Faster queries and smaller bundle size
- **Simplicity**: No complex migration files, direct SQL
- **Cost**: D1 is more cost-effective than traditional databases

### Migration Benefits
- **Simplified Schema**: JSON storage instead of complex relations
- **Better Performance**: SQLite is faster for read operations
- **Cloudflare Integration**: Native support for Cloudflare ecosystem
- **Development Experience**: Better local development with SQLite

## 🗄️ Schema Comparison

### Before (Prisma)
```prisma
model Resume {
  id          String   @id @default(cuid())
  title       String
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  template    Template @relation(fields: [templateId], references: [id])
  templateId  String
  // Separate models for each section
  experiences Experience[]
  educations  Education[]
  skills      Skill[]
  // ... many more relations
}

model Experience {
  id        String @id @default(cuid())
  position  String
  company   String
  resume    Resume @relation(fields: [resumeId], references: [id])
  resumeId  String
}
// ... many more models
```

### After (Drizzle)
```typescript
// Simple, efficient schema with JSON storage
export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  templateId: text('template_id').notNull().references(() => templates.id),
  title: text('title').notNull(),
  content: text('content'), // ALL resume data as JSON
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

## 🔧 Setup Process

### 1. Install Dependencies

```bash
# Remove Prisma
npm uninstall prisma @prisma/client

# Install Drizzle + D1
npm install drizzle-orm drizzle-kit @cloudflare/d1 better-sqlite3 @types/better-sqlite3
```

### 2. Create Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  ...(process.env.NODE_ENV === 'production' 
    ? {
        driver: 'd1-http',
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
          token: process.env.CLOUDFLARE_API_TOKEN!,
        }
      }
    : {
        dbCredentials: {
          url: './dev.db'
        }
      }
  )
});
```

### 3. Define Schema

```typescript
// src/lib/db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  stackId: text('stack_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull().default('professional'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  isPremium: integer('is_premium', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => templates.id),
  title: text('title').notNull(),
  slug: text('slug').unique(),
  content: text('content'), // JSON string with all resume data
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  isPublished: integer('is_published', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

### 4. Setup Database Connection

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

let db: any;

if (process.env.NODE_ENV === 'production') {
  // Production: Cloudflare D1
  const d1Database = (globalThis as any).DB;
  db = drizzle(d1Database, { schema });
} else {
  // Development: SQLite
  const sqlite = new Database('./dev.db');
  sqlite.exec('PRAGMA foreign_keys = ON;');
  db = drizzleBetterSqlite(sqlite, { schema });
}

export { db };
export * from './schema';
```

## 🚀 Production Deployment

### 1. Create D1 Database

```bash
# Create database
npx wrangler d1 create resync-production

# This will output something like:
# database_id = "xxxx-xxxx-xxxx-xxxx"
```

### 2. Update wrangler.toml

```toml
name = "resync"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "resync-production"
database_id = "your-database-id-here"
```

### 3. Environment Variables

```bash
# .env.production
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_D1_DATABASE_ID=your-database-id
CLOUDFLARE_API_TOKEN=your-api-token
```

### 4. Deploy Schema

```bash
# Generate migrations
npm run db:generate

# Deploy to D1
npm run db:migrate:prod
```

## 📊 Data Migration Strategy

### JSON Content Structure

```typescript
// Resume content stored as JSON
interface ResumeContent {
  personal: {
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    location?: string;
    description?: string;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    location?: string;
    gpa?: string;
  }>;
  // ... other sections
}
```

### Migration Script Example

```typescript
// migrate-from-prisma.ts
async function migrateFromPrisma() {
  const prismaResumes = await prisma.resume.findMany({
    include: {
      user: true,
      template: true,
      experiences: true,
      educations: true,
      skills: true,
      // ... all relations
    }
  });

  for (const resume of prismaResumes) {
    const content = {
      personal: {
        full_name: resume.user.name,
        email: resume.user.email,
        // ... map user data
      },
      experience: resume.experiences.map(exp => ({
        id: exp.id,
        position: exp.position,
        company: exp.company,
        // ... map experience data
      })),
      // ... map all other sections
    };

    await db.insert(resumes).values({
      id: resume.id,
      userId: resume.userId,
      templateId: resume.templateId,
      title: resume.title,
      content: JSON.stringify(content),
      isPublic: resume.isPublic,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  }
}
```

## 🧪 Testing the Setup

### 1. Test Database Connection

```bash
curl "http://localhost:3000/api/test/db"
```

### 2. Test Templates

```bash
curl "http://localhost:3000/api/templates"
```

### 3. Test Resume Creation

```bash
curl -X POST "http://localhost:3000/api/resumes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Resume","templateId":"modern"}'
```

## 🔍 Performance Benefits

### Query Performance
- **SQLite**: Faster read operations, especially for complex data
- **JSON Storage**: No complex JOINs, single query for complete resume
- **Indexing**: Strategic indexes on frequently queried fields

### Bundle Size
- **Drizzle**: ~50% smaller than Prisma client
- **Tree Shaking**: Only used parts included in bundle
- **Runtime**: Faster query execution

### Development Experience
- **Type Safety**: Better TypeScript inference
- **SQL Control**: Direct SQL when needed
- **Migration**: Simpler migration process

## 🛠️ Best Practices

### 1. Schema Design
- Use JSON for complex nested data
- Index frequently queried fields
- Keep foreign keys simple
- Use proper TypeScript types

### 2. Queries
- Use select() to fetch only needed fields
- Implement proper pagination
- Cache frequently accessed data
- Use prepared statements for repeated queries

### 3. Validation
- Use Zod for runtime validation
- Validate at API boundaries
- Type-safe database operations
- Handle edge cases properly

## 🔧 Troubleshooting

### Common Issues

1. **Foreign Key Constraints**
   ```bash
   # Enable foreign keys in development
   sqlite.exec('PRAGMA foreign_keys = ON;');
   ```

2. **D1 Connection Issues**
   ```bash
   # Check binding in wrangler.toml
   # Verify environment variables
   # Test with wrangler dev --local
   ```

3. **Migration Conflicts**
   ```bash
   # Reset and regenerate migrations
   rm -rf drizzle
   npm run db:generate
   ```

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Original Setup Guide](https://dev.to/sh20raj/cloudflare-d1-drizzle-orm-setup-guide-3oap)
- [SQLite Best Practices](https://www.sqlite.org/lang.html)
