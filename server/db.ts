import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Fallback DATABASE_URL for development when database is not yet provisioned
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found. Using placeholder connection.");
  console.warn("📝 Please provision a PostgreSQL database in Replit's Database tab.");
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });