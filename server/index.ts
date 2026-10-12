import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { checkDatabaseConnection, pool } from './db.js';
import {
  localLoginSchema,
  localRegisterSchema,
  loginLocal,
  loginSocial,
  socialLoginSchema,
  registerLocal,
  requireAdmin,
  requireAuth,
  type AuthenticatedRequest,
} from './auth.js';
import {
  createPlace, createRoute, deletePlace, deleteRoute, getPlaceById, getRouteById, listPlaces, listRoutes, placeSchema, routeSchema, updatePlace, updateRoute,
} from './catalog.js';

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);

async function closeDatabase() {
  await pool.end();
  process.exit(0);
}

process.once('SIGINT', closeDatabase);
process.once('SIGTERM', closeDatabase);

app.disable('x-powered-by');
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', request.header('origin') || '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  return next();
});
app.use(express.json({ limit: '1mb' }));

// Middleware de auditoría y diagnóstico de peticiones HTTP en tiempo real
app.use((request, response, next) => {
  const start = Date.now();
  const ip = (request.headers['x-forwarded-for'] as string) || request.socket.remoteAddress || 'local';

  response.on('finish', () => {
    const duration = Date.now() - start;
    const status = response.statusCode;
    const time = new Date().toLocaleTimeString('es-CO', { hour12: false });

    // Colores ANSI para terminal
    const statusColor =
      status >= 500
        ? '\x1b[31m' // Rojo (error de servidor)
        : status >= 400
        ? '\x1b[33m' // Amarillo (error cliente)
        : status >= 300
        ? '\x1b[36m' // Cyan (redirección)
        : '\x1b[32m'; // Verde (éxito)
    const reset = '\x1b[0m';
    const methodColor = '\x1b[35m'; // Magenta
    const grey = '\x1b[90m';

    console.log(
      `[${grey}${time}${reset}] ${methodColor}${request.method.padEnd(6)}${reset} ${request.originalUrl} -> ${statusColor}${status}${reset} (${duration}ms) ${grey}[${ip}]${reset}`
    );
  });
  next();
});

// Endpoint de telemetría: recibe eventos y errores del cliente móvil
app.post('/api/logs', (request, response) => {
  const { level = 'info', tag = 'APP', message, details } = request.body || {};
  const time = new Date().toLocaleTimeString('es-CO', { hour12: false });
  const reset = '\x1b[0m';
  const tagColor = '\x1b[36m'; // Cyan
  const levelColor = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
  const detailsStr = details ? ` | ${JSON.stringify(details)}` : '';

  console.log(
    `[${time}] ${levelColor}[CLIENT:${String(level).toUpperCase()}]${reset} ${tagColor}[${tag}]${reset} ${message || ''}${detailsStr}`
  );
  return response.status(200).json({ ok: true });
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de acceso. Espera 15 minutos antes de reintentar.' },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

const idSchema = z.coerce.number().int().positive();
const pageSchema = z.coerce.number().int().min(1).max(10000).default(1);
const limitSchema = z.coerce.number().int().min(1).max(100).default(20);
const favoriteSchema = z.object({ type: z.enum(['place', 'route']), id: idSchema });
const reviewSchema = z.object({ placeId: idSchema.optional(), routeId: idSchema.optional(), rating: z.number().int().min(1).max(5), comment: z.string().trim().min(2).max(5000), photoUrl: z.string().url().max(1000).optional() }).refine((value) => Boolean(value.placeId) !== Boolean(value.routeId));

app.post('/api/auth/register', async (request, response) => {
  const parsed = localRegisterSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Datos de registro inválidos' });
  try {
    return response.status(201).json(await registerLocal(parsed.data));
  } catch (error) {
    console.error('Registration failed:', error);
    return response.status(400).json({ message: 'No se pudo crear la cuenta' });
  }
});

app.post('/api/auth/login', async (request, response) => {
  const parsed = localLoginSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Datos de acceso inválidos' });
  try {
    return response.json(await loginLocal(parsed.data));
  } catch (error) {
    console.error('Login failed:', error);
    return response.status(401).json({ message: 'No se pudo iniciar sesión' });
  }
});

for (const provider of ['google', 'apple'] as const) {
  app.post(`/api/auth/${provider}`, async (request, response) => {
    const parsed = socialLoginSchema.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ message: 'idToken inválido' });
    try {
      return response.json(await loginSocial(provider, parsed.data));
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      return response.status(401).json({ message: `No se pudo iniciar sesión con ${provider}` });
    }
  });
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'rutigo-api' });
});

app.get('/api/health/database', async (_request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error);
    response.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.get('/api/me', requireAuth, async (request: AuthenticatedRequest, response) => {
  const [rows] = await import('./db.js').then(({ pool }) => pool.execute('SELECT id, name, email, role, status, home_city, avatar_url, created_at FROM users WHERE id = ?', [request.user!.id]));
  return response.json((rows as unknown[])[0]);
});

app.get('/api/municipalities', async (_request, response) => {
  const { pool } = await import('./db.js');
  const [rows] = await pool.execute('SELECT id, name, department, latitude, longitude FROM municipalities ORDER BY name');
  return response.json(rows);
});

app.get('/api/places', async (request, response) => {
  const query = { category: typeof request.query.category === 'string' ? request.query.category : undefined, municipalityId: request.query.municipalityId ? Number(request.query.municipalityId) : undefined, search: typeof request.query.search === 'string' ? request.query.search.trim() : undefined, page: pageSchema.parse(request.query.page), limit: limitSchema.parse(request.query.limit) };
  return response.json(await listPlaces(query));
});

app.get('/api/places/:id', async (request, response) => {
  const parsedId = idSchema.safeParse(request.params.id);
  if (!parsedId.success) return response.status(400).json({ message: 'ID de lugar inválido' });
  const place = await getPlaceById(parsedId.data);
  if (!place) return response.status(404).json({ message: 'Lugar no encontrado' });
  return response.json(place);
});

app.get('/api/routes', async (request, response) => {
  const query = { category: typeof request.query.category === 'string' ? request.query.category : undefined, search: typeof request.query.search === 'string' ? request.query.search.trim() : undefined, page: pageSchema.parse(request.query.page), limit: limitSchema.parse(request.query.limit) };
  return response.json(await listRoutes(query));
});

app.get('/api/routes/:id', async (request, response) => {
  const parsedId = idSchema.safeParse(request.params.id);
  if (!parsedId.success) return response.status(400).json({ message: 'ID de ruta inválido' });
  const route = await getRouteById(parsedId.data);
  if (!route) return response.status(404).json({ message: 'Ruta no encontrada' });
  return response.json(route);
});

app.post('/api/favorites', requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = favoriteSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Favorito inválido' });
  const { pool } = await import('./db.js');
  const column = parsed.data.type === 'place' ? 'place_id' : 'route_id';
  await pool.execute(`INSERT IGNORE INTO user_favorites (user_id, ${column}) VALUES (?, ?)`, [request.user!.id, parsed.data.id]);
  return response.status(201).json({ ok: true });
});

app.delete('/api/favorites/:type/:id', requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = favoriteSchema.safeParse({ type: request.params.type, id: request.params.id });
  if (!parsed.success) return response.status(400).json({ message: 'Favorito inválido' });
  const { pool } = await import('./db.js');
  const column = parsed.data.type === 'place' ? 'place_id' : 'route_id';
  await pool.execute(`DELETE FROM user_favorites WHERE user_id = ? AND ${column} = ?`, [request.user!.id, parsed.data.id]);
  return response.status(204).send();
});

app.get('/api/reviews', async (request, response) => {
  const { pool } = await import('./db.js');
  const target = request.query.placeId ? ['place_id', Number(request.query.placeId)] : request.query.routeId ? ['route_id', Number(request.query.routeId)] : null;
  const [rows] = target ? await pool.execute(`SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.${target[0]} = ? AND r.deleted_at IS NULL ORDER BY r.created_at DESC`, [target[1]]) : await pool.execute('SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.deleted_at IS NULL ORDER BY r.created_at DESC');
  return response.json(rows);
});

app.post('/api/reviews', requireAuth, async (request: AuthenticatedRequest, response) => {
  const parsed = reviewSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Reseña inválida' });
  const { pool } = await import('./db.js');
  const [result] = await pool.execute('INSERT INTO reviews (user_id, place_id, route_id, rating, comment, photo_url) VALUES (?, ?, ?, ?, ?, ?)', [request.user!.id, parsed.data.placeId || null, parsed.data.routeId || null, parsed.data.rating, parsed.data.comment, parsed.data.photoUrl || null]);
  const reviewId = (result as { insertId: number }).insertId;
  if (parsed.data.placeId) {
    await pool.execute(
      `UPDATE places p
       SET review_count = (SELECT COUNT(*) FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL),
           average_rating = COALESCE((SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL), 0)
       WHERE p.id = ?`,
      [parsed.data.placeId]
    );
  }
  if (parsed.data.routeId) {
    await pool.execute(
      `UPDATE routes r
       SET review_count = (SELECT COUNT(*) FROM reviews rv WHERE rv.route_id = r.id AND rv.deleted_at IS NULL),
           average_rating = COALESCE((SELECT ROUND(AVG(rv.rating), 2) FROM reviews rv WHERE rv.route_id = r.id AND rv.deleted_at IS NULL), 0)
       WHERE r.id = ?`,
      [parsed.data.routeId]
    );
  }
  return response.status(201).json({
    id: reviewId,
    user_id: request.user!.id,
    place_id: parsed.data.placeId || null,
    route_id: parsed.data.routeId || null,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    photo_url: parsed.data.photoUrl || null,
    created_at: new Date().toISOString(),
  });
});

app.patch('/api/reviews/:id', requireAuth, async (request: AuthenticatedRequest, response) => {
  const id = idSchema.parse(request.params.id);
  const parsed = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().min(2).max(5000) }).safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Reseña inválida' });
  const [result] = await pool.execute('UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ? AND deleted_at IS NULL', [parsed.data.rating, parsed.data.comment, id, request.user!.id]);
  if ((result as { affectedRows: number }).affectedRows === 0) return response.status(404).json({ message: 'Reseña no encontrada' });
  return response.json({ id, rating: parsed.data.rating, comment: parsed.data.comment });
});

app.delete('/api/reviews/:id', requireAuth, async (request: AuthenticatedRequest, response) => {
  const id = idSchema.parse(request.params.id);
  const [result] = await pool.execute('UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ? AND (user_id = ? OR ? IN (SELECT id FROM users WHERE role = \'admin\')) AND deleted_at IS NULL', [id, request.user!.id, request.user!.id]);
  if ((result as { affectedRows: number }).affectedRows === 0) return response.status(404).json({ message: 'Reseña no encontrada' });
  return response.status(204).send();
});

app.get('/api/notifications', requireAuth, async (request: AuthenticatedRequest, response) => {
  const [rows] = await pool.execute('SELECT id, user_id, type, title, body, related_type, related_id, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [request.user!.id]);
  return response.json(rows);
});

app.patch('/api/notifications/:id/read', requireAuth, async (request: AuthenticatedRequest, response) => {
  await pool.execute('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [idSchema.parse(request.params.id), request.user!.id]);
  return response.status(204).send();
});

app.get('/api/admin/users', requireAuth, requireAdmin, async (request, response) => {
  const { pool } = await import('./db.js');
  const [rows] = await pool.execute('SELECT id, name, email, auth_provider, role, status, home_city, created_at, last_login_at FROM users ORDER BY created_at DESC');
  return response.json(rows);
});

app.patch('/api/admin/users/:id/block', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const id = idSchema.parse(request.params.id);
  const { pool } = await import('./db.js');
  await pool.execute('UPDATE users SET status = \'blocked\', blocked_at = CURRENT_TIMESTAMP(3), blocked_by = ? WHERE id = ? AND role <> \'admin\'', [request.user!.id, id]);
  await pool.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)', [request.user!.id, 'block', 'user', id, JSON.stringify({ reason: request.body?.reason || null })]);
  return response.json({ ok: true });
});

app.patch('/api/admin/users/:id/unblock', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const id = idSchema.parse(request.params.id);
  const { pool } = await import('./db.js');
  await pool.execute('UPDATE users SET status = \'active\', blocked_at = NULL, blocked_by = NULL, block_reason = NULL WHERE id = ?', [id]);
  await pool.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [request.user!.id, 'unblock', 'user', id]);
  return response.json({ ok: true });
});

app.post('/api/admin/places', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const parsed = placeSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Lugar inválido', issues: parsed.error.issues });
  return response.status(201).json({ id: await createPlace(parsed.data, request.user!.id) });
});

app.patch('/api/admin/places/:id', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const parsed = placeSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Lugar inválido', issues: parsed.error.issues });
  await updatePlace(idSchema.parse(request.params.id), parsed.data, request.user!.id);
  return response.json({ ok: true });
});

app.delete('/api/admin/places/:id', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  await deletePlace(idSchema.parse(request.params.id), request.user!.id);
  return response.status(204).send();
});

app.post('/api/admin/routes', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const parsed = routeSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Ruta inválida', issues: parsed.error.issues });
  return response.status(201).json({ id: await createRoute(parsed.data, request.user!.id) });
});

app.patch('/api/admin/routes/:id', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  const parsed = routeSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: 'Ruta inválida', issues: parsed.error.issues });
  await updateRoute(idSchema.parse(request.params.id), parsed.data, request.user!.id);
  return response.json({ ok: true });
});

app.delete('/api/admin/routes/:id', requireAuth, requireAdmin, async (request: AuthenticatedRequest, response) => {
  await deleteRoute(idSchema.parse(request.params.id), request.user!.id);
  return response.status(204).send();
});

app.listen(port, () => {
  console.log(`RutiGo API escuchando en http://localhost:${port}`);
});
