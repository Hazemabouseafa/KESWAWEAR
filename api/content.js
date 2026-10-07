import { getSql, ensureTables, getConnectionString } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connStr = getConnectionString();
  if (!connStr) {
    return res.status(200).json({
      success: false,
      connected: false,
      message: 'No DATABASE_URL configured'
    });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM site_content WHERE id = 'current' LIMIT 1;`;
      if (rows.length > 0) {
        return res.status(200).json({
          success: true,
          data: rows[0].data
        });
      }
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const contentData = body.data || body;

      await sql`
        INSERT INTO site_content (id, data, updated_at)
        VALUES ('current', ${JSON.stringify(contentData)}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = ${JSON.stringify(contentData)}::jsonb, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        message: 'Site content updated in Neon PostgreSQL'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Neon content error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
