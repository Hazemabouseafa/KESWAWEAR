import { getSql, ensureTables, getConnectionString } from './db.js';

// In-memory fallback cache for when DATABASE_URL is not yet configured or during warm lambda invocations
let memoryOrdersCache = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
  if (!connStr) {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        connected: false,
        orders: memoryOrdersCache || []
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      if (Array.isArray(body)) {
        memoryOrdersCache = body;
        return res.status(200).json({ success: true, connected: false, message: 'Orders batch cached' });
      }

      const order = body?.order || body;
      if (!order || !order.id) {
        return res.status(400).json({ error: 'Order ID is required' });
      }

      const existing = (memoryOrdersCache || []).filter(o => o.id !== order.id);
      memoryOrdersCache = [order, ...existing];

      return res.status(200).json({
        success: true,
        connected: false,
        order
      });
    }

    if (req.method === 'DELETE') {
      const isClearAll = req.query?.clearAll === 'true' || body?.clearAll === true;
      if (isClearAll) {
        memoryOrdersCache = [];
        return res.status(200).json({ success: true, connected: false, message: 'All orders cleared from cache' });
      }

      const id = req.query?.id || body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Missing order ID to delete' });
      }

      if (memoryOrdersCache) {
        memoryOrdersCache = memoryOrdersCache.filter(o => o.id !== id);
      }

      return res.status(200).json({
        success: true,
        connected: false,
        message: `Order ${id} deleted from cache`
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
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

    // DELETE: Remove order or clear all
    if (req.method === 'DELETE') {
      const isClearAll = req.query?.clearAll === 'true' || body?.clearAll === true;
      if (isClearAll) {
        await sql`DELETE FROM orders;`;
        memoryOrdersCache = [];
        return res.status(200).json({
          success: true,
          connected: true,
          message: 'All orders cleared from Neon'
        });
      }

      const id = req.query.id || (typeof req.body === 'object' ? req.body?.id : null);
      if (!id) {
        return res.status(400).json({ error: 'Missing order ID to delete' });
      }

      await sql`
        DELETE FROM orders WHERE id = ${id};
      `;

      if (memoryOrdersCache) {
        memoryOrdersCache = memoryOrdersCache.filter(o => o.id !== id);
      }

      return res.status(200).json({
        success: true,
        connected: true,
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
