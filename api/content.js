import { getSql, ensureTables, getConnectionString } from './db.js';

// In-memory fallback cache for when DATABASE_URL is not yet configured or during warm lambda invocations
let memoryContentCache = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const connStr = getConnectionString();

  // If no DATABASE_URL configured on Vercel, use graceful memory fallback
  if (!connStr) {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        connected: false,
        data: memoryContentCache
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const contentData = body?.data || body;
      memoryContentCache = contentData;
      return res.status(200).json({
        success: true,
        connected: false,
        message: 'Content cached in server memory (DATABASE_URL not configured)'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM site_content WHERE id = 'current' LIMIT 1;`;
      if (rows.length > 0 && rows[0].data) {
        memoryContentCache = rows[0].data;
        return res.status(200).json({
          success: true,
          connected: true,
          data: rows[0].data
        });
      }
      return res.status(200).json({
        success: true,
        connected: true,
        data: memoryContentCache
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const contentData = body?.data || body;
      memoryContentCache = contentData;

      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(contentData)}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        connected: true,
        message: 'Site content updated in Neon PostgreSQL'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Neon content error:', err);
    // Even if database has a hiccup, return memory cache if available
    if (req.method === 'GET' && memoryContentCache) {
      return res.status(200).json({
        success: true,
        connected: false,
        data: memoryContentCache
      });
    }
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
