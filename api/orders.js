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
      orders: []
    });
  }

  try {
    const sql = getSql();
    await ensureTables(sql);

    // GET: Fetch all orders
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT data FROM orders ORDER BY created_at DESC;
      `;
      const orders = rows.map(r => r.data);
      return res.status(200).json({
        success: true,
        orders
      });
    }

    // POST / PUT: Upsert order or batch
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Batch sync
      if (Array.isArray(body)) {
        for (const item of body) {
          if (item && item.id) {
            await sql`
              INSERT INTO orders (id, data, status, total, created_at)
              VALUES (
                ${item.id}, 
                ${JSON.stringify(item)}::jsonb, 
                ${item.status || 'Pending'}, 
                ${Number(item.total) || 0}, 
                ${item.date ? new Date(item.date) : new Date()}
              )
              ON CONFLICT (id)
              DO UPDATE SET 
                data = ${JSON.stringify(item)}::jsonb, 
                status = ${item.status || 'Pending'}, 
                total = ${Number(item.total) || 0};
            `;
          }
        }
        return res.status(200).json({ success: true, message: 'Orders batch saved to Neon' });
      }

      // Single order
      const order = body.order || body;
      if (!order || !order.id) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      await sql`
        INSERT INTO orders (id, data, status, total, created_at)
        VALUES (
          ${order.id}, 
          ${JSON.stringify(order)}::jsonb, 
          ${order.status || 'Pending'}, 
          ${Number(order.total) || 0}, 
          ${order.date ? new Date(order.date) : new Date()}
        )
        ON CONFLICT (id)
        DO UPDATE SET 
          data = ${JSON.stringify(order)}::jsonb, 
          status = ${order.status || 'Pending'}, 
          total = ${Number(order.total) || 0};
      `;

      return res.status(200).json({
        success: true,
        order
      });
    }

    // DELETE: Remove order
    if (req.method === 'DELETE') {
      const id = req.query.id || (typeof req.body === 'object' ? req.body?.id : null);
      if (!id) {
        return res.status(400).json({ error: 'Missing order ID to delete' });
      }

      await sql`
        DELETE FROM orders WHERE id = ${id};
      `;

      return res.status(200).json({
        success: true,
        message: `Order ${id} deleted from Neon`
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Neon orders error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
