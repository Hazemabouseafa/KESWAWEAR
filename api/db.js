import { neon } from '@neondatabase/serverless';

/**
 * Get the Neon connection string from environment variables
 * Automatically populated by Vercel Neon Integration
 */
export function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL ||
    ''
  ).trim();
}

/**
 * Returns a Neon Serverless SQL client or null if not configured
 */
export function getSql() {
  const connStr = getConnectionString();
  if (!connStr) return null;
  return neon(connStr);
}

/**
 * Ensure database tables exist in Neon PostgreSQL (keswawear database)
 */
export async function ensureTables(sql) {
  if (!sql) return;

  // 1. Site Content Table
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. Products Catalog Table
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 3. Customer Orders Table
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      total NUMERIC(10, 2) DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}
