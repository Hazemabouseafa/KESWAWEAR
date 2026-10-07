import { getSql, ensureTables, getConnectionString } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connStr = getConnectionString();
  if (!connStr) {
    return res.status(400).json({
      success: false,
      message: 'DATABASE_URL is not set'
    });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // If client provided seed data:
    if (body.siteContent) {
      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(body.siteContent)}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(body.siteContent)}::jsonb;
      `;
    }

    if (body.products && Array.isArray(body.products)) {
      for (const p of body.products) {
        if (p && p.id) {
          await sql`
            INSERT INTO products (id, data, updated_at)
            VALUES (${p.id}, ${JSON.stringify(p)}::jsonb, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(p)}::jsonb;
          `;
        }
      }
    }

    if (body.orders && Array.isArray(body.orders)) {
      for (const o of body.orders) {
        if (o && o.id) {
          await sql`
            INSERT INTO orders (id, data, status, total, created_at)
            VALUES (${o.id}, ${JSON.stringify(o)}::jsonb, ${o.status || 'Pending'}, ${Number(o.total) || 0}, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(o)}::jsonb;
          `;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Neon PostgreSQL database tables and seed data initialized successfully in keswawear!',
      database: 'keswawear'
    });
  } catch (err) {
    console.error('Neon init-db error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
