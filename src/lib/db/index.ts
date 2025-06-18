import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// For development
import Database from 'better-sqlite3';
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3';

export function getDB() {
  if (process.env.NODE_ENV === 'production') {
    // Production: Use Cloudflare D1
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getCloudflareContext } = require('@opennextjs/cloudflare');
      const { env } = getCloudflareContext();
      return drizzle(env.DB, { schema });
    } catch (error) {
      console.error('Failed to get Cloudflare context:', error);
      throw new Error('Database not available in production');
    }
  } else {
    // Development: Use better-sqlite3
    const sqlite = new Database('./dev.db');
    sqlite.exec('PRAGMA foreign_keys = ON;');
    return drizzleBetterSqlite(sqlite, { schema });
  }
}

export const db = getDB();
export * from './schema';