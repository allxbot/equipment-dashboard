export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '').split('/');
  const table = path[0]; // matrix, mil, or todo
  const method = request.method;

  if (!['matrix', 'mil', 'todo'].includes(table)) {
    return new Response('Invalid table', { status: 400 });
  }

  try {
    // --- GET: 获取数据 ---
    if (method === 'GET') {
      const { results } = await env.DB.prepare(`SELECT * FROM ${table}`).all();
      return Response.json(results);
    }

    // --- POST: 新增或更新数据 ---
    if (method === 'POST') {
      const data = await request.json();
      
      if (table === 'matrix') {
        // Matrix 使用自增 ID，通常是新增
        await env.DB.prepare(
          `INSERT INTO matrix (site, project, line, sub, status, progress, dates, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(data.site, data.project, data.line, data.sub, data.status, data.progress, JSON.stringify(data.dates), data.remark).run();
      } else {
        // MIL 和 TODO 使用自定义 ID (如 MIL-001)，作为主键处理 (Upsert 逻辑用 Replace)
        const cols = Object.keys(data).join(',');
        const vals = Object.values(data);
        const placeholders = vals.map(() => '?').join(',');
        
        await env.DB.prepare(
          `INSERT OR REPLACE INTO ${table} (${cols}) VALUES (${placeholders})`
        ).bind(...vals).run();
      }
      return new Response('Saved', { status: 200 });
    }

    // --- DELETE: 删除数据 ---
    if (method === 'DELETE') {
      const id = path[1]; // /api/matrix/1
      if (!id) return new Response('ID required', { status: 400 });

      // Matrix ID 是数字，其他是字符串
      if (table === 'matrix') {
        await env.DB.prepare(`DELETE FROM matrix WHERE id = ?`).bind(parseInt(id)).run();
      } else {
        await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
      }
      return new Response('Deleted', { status: 200 });
    }

  } catch (e) {
    return new Response(e.message, { status: 500 });
  }

  return new Response('Method not allowed', { status: 405 });
}
