import { defineConfig } from "drizzle-kit";

// Fallback DATABASE_URL for development
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found in drizzle config. Please provision a database.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
