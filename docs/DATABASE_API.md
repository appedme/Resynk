# Database API Documentation

## 🎯 Overview

The Resync application uses **Drizzle ORM** with **Cloudflare D1** (production) and **SQLite** (development) for data storage. All operations are handled through **Next.js 15 Server Actions** for type safety and performance.

## 🏗️ Architecture

### Database Schema

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    users    │    │  templates   │    │   resumes   │
├─────────────┤    ├──────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)      │    │ id (PK)     │
│ stackId     │    │ name         │    │ userId (FK) │
│ email       │    │ description  │    │ templateId  │
│ name        │    │ category     │    │ title       │
│ avatar      │    │ isPublic     │    │ content*    │
│ createdAt   │    │ isPremium    │    │ isPublic    │
│ updatedAt   │    │ createdAt    │    │ isPublished │
└─────────────┘    └──────────────┘    │ createdAt   │
                                       │ updatedAt   │
                                       └─────────────┘
```

*`content` field stores complete resume data as JSON

### Content Structure

The `content` field in resumes stores all resume data as JSON:

```typescript
interface ResumeContent {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  customSections: CustomSection[];
}
```

## 🚀 Server Actions

All database operations use Server Actions located in `src/lib/actions.ts`:

### User Actions

#### `createOrUpdateUser(stackUser)`
Creates or updates a user from StackAuth data.

```typescript
const user = await createOrUpdateUser({
  id: "stack_user_id",
  primaryEmail: "user@example.com",
  displayName: "John Doe",
  profileImageUrl: "https://avatar.url"
});
```

### Template Actions

#### `getTemplates()`
Retrieves all public templates.

```typescript
const templates = await getTemplates();
// Returns: Template[]
```

#### `getTemplateById(templateId)`
Gets a specific template by ID.

```typescript
const template = await getTemplateById("modern");
// Returns: Template | null
```

### Resume Actions

#### `getUserResumes()`
Gets all resumes for the authenticated user.

```typescript
const resumes = await getUserResumes();
// Returns: Resume[]
```

#### `getResumeById(resumeId)`
Gets a specific resume by ID (user must own it).

```typescript
const resume = await getResumeById("resume_id");
// Returns: Resume | null
```

#### `createResume(data)`
Creates a new resume for the authenticated user.

```typescript
const result = await createResume({
  title: "My Resume",
  templateId: "modern",
  content: { /* resume data */ }
});

// Returns: { success: boolean; resumeId?: string; error?: string }
```

#### `updateResume(resumeId, data)`
Updates an existing resume.

```typescript
const result = await updateResume("resume_id", {
  title: "Updated Title",
  content: { /* updated resume data */ },
  isPublic: true
});

// Returns: { success: boolean; error?: string }
```

#### `deleteResume(resumeId)`
Deletes a resume (user must own it).

```typescript
const result = await deleteResume("resume_id");
// Returns: { success: boolean; error?: string }
```

#### `duplicateResume(resumeId)`
Creates a copy of an existing resume.

```typescript
const result = await duplicateResume("resume_id");
// Returns: { success: boolean; resumeId?: string; error?: string }
```

## 🌐 API Endpoints

### Templates API

#### `GET /api/templates`
Returns all public templates.

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "modern",
      "name": "Modern",
      "description": "Clean modern design",
      "category": "professional",
      "isPublic": true,
      "isPremium": false
    }
  ]
}
```

### Resumes API

#### `GET /api/resumes`
Returns all resumes for authenticated user.

**Response:**
```json
{
  "success": true,
  "resumes": [
    {
      "id": "resume_id",
      "title": "My Resume",
      "templateId": "modern",
      "isPublic": false,
      "isPublished": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `GET /api/resumes?id=resume_id`
Returns specific resume with full content.

**Response:**
```json
{
  "success": true,
  "resume": {
    "id": "resume_id",
    "title": "My Resume",
    "templateId": "modern",
    "content": {
      "personal": {
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "experience": [],
      "education": []
    }
  }
}
```

#### `POST /api/resumes`
Creates new resume or updates existing one.

**Create Resume:**
```json
{
  "title": "New Resume",
  "templateId": "modern",
  "content": { /* resume data */ }
}
```

**Update Resume:**
```json
{
  "id": "resume_id",
  "content": { /* updated resume data */ }
}
```

### Database Test API

#### `GET /api/test/db`
Tests database connection and returns statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "counts": {
      "users": 5,
      "resumes": 12,
      "templates": 5
    },
    "recentUsers": [],
    "templates": [],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔐 Authentication

All protected endpoints use StackAuth for authentication:

```typescript
// Check authentication in API routes
const user = await stackServerApp.getUser();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Server Actions automatically handle authentication through the `getAuthenticatedUser()` helper.

## 🛡️ Validation

All data is validated using Zod schemas:

### User Schema
```typescript
const userSchema = z.object({
  stackId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
});
```

### Resume Schema
```typescript
const resumeSchema = z.object({
  title: z.string().min(1).max(100),
  templateId: z.string().min(1),
  content: resumeDataSchema.optional(),
  isPublic: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});
```

### Resume Data Schema
```typescript
const resumeDataSchema = z.object({
  personal: z.object({
    full_name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(50).optional(),
    // ... other fields
  }),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  // ... other sections
});
```

## 📊 Database Operations

### Direct Database Access

For complex queries, you can use the database directly:

```typescript
import { db, users, resumes } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';

// Get user with resume count
const userWithResumeCount = await db
  .select({
    id: users.id,
    name: users.name,
    resumeCount: count(resumes.id)
  })
  .from(users)
  .leftJoin(resumes, eq(users.id, resumes.userId))
  .where(eq(users.id, userId))
  .groupBy(users.id);
```

### Seeding

Database seeding is handled by `src/lib/db/seed.ts`:

```bash
# Seed database
npm run db:seed
```

Default templates are automatically created:
- Modern
- Professional  
- Creative
- Minimal
- Academic

## 🔧 Configuration

### Development
- **Database**: `./dev.db` (SQLite file)
- **ORM**: Drizzle with better-sqlite3
- **Migrations**: Auto-applied with `db:push`

### Production
- **Database**: Cloudflare D1
- **ORM**: Drizzle with D1 HTTP API
- **Migrations**: Applied with `db:migrate:prod`

## 🚨 Error Handling

All operations include proper error handling:

```typescript
try {
  const result = await createResume(data);
  if (!result.success) {
    console.error('Resume creation failed:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

Common error responses:
- `401 Unauthorized` - Authentication required
- `400 Bad Request` - Invalid data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 📈 Performance

### Optimization Strategies

1. **JSON Storage**: Single query for complete resume data
2. **Indexes**: Strategic indexing on frequently queried fields
3. **Server Actions**: Reduced client-server round trips
4. **Type Safety**: Compile-time error prevention
5. **Prepared Statements**: Automatic query optimization

### Monitoring

```typescript
// Database connection check
import { isDatabaseAvailable, getDatabaseType } from '@/lib/db';

console.log('Database available:', isDatabaseAvailable());
console.log('Database type:', getDatabaseType());
```

## 🔄 Migration

For migrating from other ORMs or databases, see the [Migration Guide](./MIGRATION_GUIDE.md).
