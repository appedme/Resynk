# Resync - Database Setup Guide

## 🚀 Quick Start

The project now uses **Drizzle ORM + Cloudflare D1** for a simple, efficient database setup.

### Development Setup

```bash
# 1. Setup database (one-time)
npm run db:setup

# 2. Start development server
npm run dev
```

### Database Commands

```bash
npm run db:generate    # Generate migrations
npm run db:push        # Apply schema to database
npm run db:studio      # Open Drizzle Studio
npm run db:seed        # Seed default templates
npm run db:setup       # Complete setup (all above)
```

## 📊 Database Schema

### Simple 3-Table Design

1. **users** - StackAuth user data
2. **templates** - Resume templates  
3. **resumes** - Main data (JSON content)

### Resume Data Storage

All resume data is stored as JSON in the `content` field:

```json
{
  "personal": { "full_name": "...", "email": "..." },
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...],
  "languages": [...],
  "awards": [...],
  "customSections": [...]
}
```

## 🧪 Testing APIs

```bash
# Test database connection
curl "http://localhost:3001/api/test/db"

# Test templates
curl "http://localhost:3001/api/templates"

# Test resumes (requires authentication)
curl "http://localhost:3001/api/resumes"
```

## 🌍 Production Deployment

### Cloudflare D1 Setup

1. Create D1 database:
   ```bash
   wrangler d1 create resync-db
   ```

2. Update `wrangler.jsonc` with your database ID

3. Run migrations:
   ```bash
   wrangler d1 execute resync-db --file=./drizzle/0000_giant_umar.sql
   ```

4. Seed production data:
   ```bash
   wrangler d1 execute resync-db --command="INSERT INTO templates..."
   ```

### Environment Variables

```bash
# Development (automatic)
# Uses local SQLite: ./dev.db

# Production (Cloudflare Workers)
DB=<D1_DATABASE_BINDING>  # Set in wrangler.jsonc
```

## ✅ Migration Complete

✅ **Prisma removed** - Clean codebase  
✅ **Drizzle setup** - Modern ORM  
✅ **Simple schema** - 3 tables only  
✅ **JSON storage** - Flexible data  
✅ **Type safety** - Full TypeScript  
✅ **Server actions** - Modern Next.js  
✅ **Local dev** - SQLite ready  
✅ **Production** - D1 ready  

The database setup is complete and ready for production! 🎉
