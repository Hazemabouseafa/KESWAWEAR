import { getSql, ensureTables, getConnectionString } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const connStr = getConnectionString();
  if (!connStr) {
    return res.status(200).json({
      success: false,
      connected: false,
      products: []
    });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    // GET: Fetch all products
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT data FROM products ORDER BY updated_at DESC;
      `;
      const products = rows.map(r => r.data);
      return res.status(200).json({
        success: true,
        products
      });
    }

    // POST / PUT: Upsert product or batch
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Batch sync
      if (Array.isArray(body)) {
        for (const item of body) {
          if (item && item.id) {
            await sql`
              INSERT INTO products (id, data, updated_at)
              VALUES (${item.id}, ${JSON.stringify(item)}::jsonb, CURRENT_TIMESTAMP)
              ON CONFLICT (id)
              DO UPDATE SET data = ${JSON.stringify(item)}::jsonb, updated_at = CURRENT_TIMESTAMP;
            `;
          }
        }
        return res.status(200).json({ success: true, message: 'Products batch saved to Neon' });
      }

      // Single product
      const product = body.product || body;
      if (!product || !product.id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      await sql`
        INSERT INTO products (id, data, updated_at)
        VALUES (${product.id}, ${JSON.stringify(product)}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET data = ${JSON.stringify(product)}::jsonb, updated_at = CURRENT_TIMESTAMP;
      `;

      return res.status(200).json({
        success: true,
        product
      });
    }

    // DELETE: Remove product
    if (req.method === 'DELETE') {
      const id = req.query.id || (typeof req.body === 'object' ? req.body?.id : null);
      if (!id) {
        return res.status(400).json({ error: 'Missing product ID to delete' });
      }

      await sql`
        DELETE FROM products WHERE id = ${id};
      `;

      return res.status(200).json({
        success: true,
        message: `Product ${id} deleted from Neon`
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Neon products error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
