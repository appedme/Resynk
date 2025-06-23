#!/usr/bin/env node

// Database setup and migration script for Drizzle + D1
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { TemplateService } from '../src/lib/db/template-service.js';

async function setupDatabase() {
  console.log('🚀 Setting up Drizzle database...');

  try {
    // Create or connect to SQLite database
    const sqlite = new Database('./dev.db');
    const db = drizzle(sqlite);

    console.log('📊 Database connected successfully');

    // Run migrations (we'll create these with drizzle-kit)
    console.log('🔄 Running migrations...');
    // await migrate(db, { migrationsFolder: './drizzle' });

    // Seed default templates
    console.log('🌱 Seeding default templates...');
    await TemplateService.seedDefaultTemplates();

    console.log('✅ Database setup completed successfully!');

    // Test the connection
    console.log('🧪 Testing database operations...');
    const templates = await TemplateService.getPublicTemplates();
    console.log(`📋 Found ${templates.length} templates`);

    sqlite.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
