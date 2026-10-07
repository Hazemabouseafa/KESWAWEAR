import { getSql, ensureTables, getConnectionString } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connStr = getConnectionString();
  if (!connStr) {
    return res.status(200).json({
      success: false,
      connected: false,
      message: 'DATABASE_URL is not set. Set DATABASE_URL in Vercel project environment variables to connect Neon.',
      database: 'keswawear'
    });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    const result = await sql`SELECT 1 as connected;`;
    const prodCount = await sql`SELECT COUNT(*) as count FROM products;`;
    const orderCount = await sql`SELECT COUNT(*) as count FROM orders;`;

    return res.status(200).json({
      success: true,
      connected: true,
      database: 'keswawear',
      provider: 'Neon Serverless PostgreSQL',
      counts: {
        products: parseInt(prodCount[0]?.count || 0, 10),
        orders: parseInt(orderCount[0]?.count || 0, 10)
      }
    });
  } catch (err) {
    console.error('Neon status error:', err);
    return res.status(500).json({
      success: false,
      connected: false,
      error: err.message,
      database: 'keswawear'
    });
  }
}
