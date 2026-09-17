import { z } from 'zod';
import { pool } from './db.js';

const category = z.enum(['cultura', 'gastronomia', 'naturaleza', 'historia']);
const difficulty = z.enum(['facil', 'moderado', 'avanzado']);

export const placeSchema = z.object({
  name: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2),
  category,
  municipalityId: z.number().int().positive(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().trim().max(255).optional(),
  schedule: z.string().trim().max(255).optional(),
  estimatedTime: z.string().trim().max(80).optional(),
  tag: z.string().trim().max(100).optional(),
  priceNote: z.string().trim().max(255).optional(),
  images: z.array(z.object({ url: z.string().url().max(1000), altText: z.string().max(255).optional() })).max(20).default([]),
});

export const routeSchema = z.object({
  name: z.string().trim().min(2).max(180),
  subtitle: z.string().trim().max(255).optional(),
  description: z.string().trim().min(2),
  category,
  durationEstimate: z.string().trim().max(80).optional(),
  distanceKm: z.number().nonnegative().optional(),
  difficulty: difficulty.default('facil'),
  coverImageUrl: z.string().url().max(1000).optional(),
  priceSuggested: z.string().trim().max(255).optional(),
  tips: z.string().trim().optional(),
  placeIds: z.array(z.number().int().positive()).max(100).default([]),
  municipalityIds: z.array(z.number().int().positive()).max(50).default([]),
  highlights: z.array(z.string().trim().min(1).max(255)).max(30).default([]),
});

export async function listPlaces(query: { category?: string; municipalityId?: number; search?: string; page: number; limit: number }) {
  const conditions = ['p.deleted_at IS NULL'];
  const params: (string | number)[] = [];
  if (query.category) { conditions.push('p.category = ?'); params.push(query.category); }
  if (query.municipalityId) { conditions.push('p.municipality_id = ?'); params.push(query.municipalityId); }
  if (query.search) { conditions.push('(p.name LIKE ? OR p.description LIKE ?)'); params.push(`%${query.search}%`, `%${query.search}%`); }
  const offset = (query.page - 1) * query.limit;
  params.push(query.limit, offset);
  const [rows] = await pool.execute(
    `SELECT p.*, m.name AS municipality,
      COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('url', pi.image_url, 'altText', pi.alt_text))
           FROM place_images pi WHERE pi.place_id = p.id), JSON_ARRAY()) AS images
     FROM places p JOIN municipalities m ON m.id = p.municipality_id
     WHERE ${conditions.join(' AND ')} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, params
  );
  return rows;
}

export async function listRoutes(query: { category?: string; search?: string; page: number; limit: number }) {
  const conditions = ['r.deleted_at IS NULL'];
  const params: (string | number)[] = [];
  if (query.category) { conditions.push('r.category = ?'); params.push(query.category); }
  if (query.search) { conditions.push('(r.name LIKE ? OR r.description LIKE ?)'); params.push(`%${query.search}%`, `%${query.search}%`); }
  params.push(query.limit, (query.page - 1) * query.limit);
  const [rows] = await pool.execute(
    `SELECT r.*,
       COALESCE((SELECT JSON_ARRAYAGG(m.name) FROM route_municipalities rm JOIN municipalities m ON m.id = rm.municipality_id WHERE rm.route_id = r.id), JSON_ARRAY()) AS municipalities,
      COALESCE((SELECT JSON_ARRAYAGG(rp.place_id) FROM route_places rp WHERE rp.route_id = r.id), JSON_ARRAY()) AS place_ids,
      COALESCE((SELECT JSON_ARRAYAGG(rh.highlight) FROM route_highlights rh WHERE rh.route_id = r.id), JSON_ARRAY()) AS highlights
     FROM routes r WHERE ${conditions.join(' AND ')} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`, params
  );
  return rows;
}

async function replacePlaceImages(placeId: number, images: z.infer<typeof placeSchema>['images']) {
  await pool.execute('DELETE FROM place_images WHERE place_id = ?', [placeId]);
  for (const [index, image] of images.entries()) {
    await pool.execute('INSERT INTO place_images (place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)', [placeId, image.url, image.altText || null, index]);
  }
}

export async function createPlace(input: z.infer<typeof placeSchema>, adminId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO places (municipality_id, name, description, category, latitude, longitude, address, schedule, estimated_time, tag, price_note, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.municipalityId, input.name, input.description, input.category, input.latitude, input.longitude, input.address || null, input.schedule || null, input.estimatedTime || null, input.tag || null, input.priceNote || null, adminId]
    );
    const id = Number((result as { insertId: number }).insertId);
    for (const [index, image] of input.images.entries()) await connection.execute('INSERT INTO place_images (place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)', [id, image.url, image.altText || null, index]);
    await connection.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'create', 'place', id]);
    await connection.commit();
    return id;
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function updatePlace(id: number, input: z.infer<typeof placeSchema>, adminId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE places SET municipality_id=?, name=?, description=?, category=?, latitude=?, longitude=?, address=?, schedule=?, estimated_time=?, tag=?, price_note=? WHERE id=? AND deleted_at IS NULL`,
      [input.municipalityId, input.name, input.description, input.category, input.latitude, input.longitude, input.address || null, input.schedule || null, input.estimatedTime || null, input.tag || null, input.priceNote || null, id]
    );
    await connection.execute('DELETE FROM place_images WHERE place_id = ?', [id]);
    for (const [index, image] of input.images.entries()) await connection.execute('INSERT INTO place_images (place_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)', [id, image.url, image.altText || null, index]);
    await connection.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'update', 'place', id]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function deletePlace(id: number, adminId: number) {
  await pool.execute('UPDATE places SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ? AND deleted_at IS NULL', [id]);
  await pool.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'delete', 'place', id]);
}

export async function createRoute(input: z.infer<typeof routeSchema>, adminId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO routes (name, subtitle, description, category, duration_estimate, distance_km, difficulty, cover_image_url, price_suggested, tips, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.name, input.subtitle || null, input.description, input.category, input.durationEstimate || null, input.distanceKm ?? null, input.difficulty, input.coverImageUrl || null, input.priceSuggested || null, input.tips || null, adminId]
    );
    const id = Number((result as { insertId: number }).insertId);
    for (const [index, placeId] of input.placeIds.entries()) await connection.execute('INSERT INTO route_places (route_id, place_id, stop_order) VALUES (?, ?, ?)', [id, placeId, index]);
    for (const municipalityId of input.municipalityIds) await connection.execute('INSERT INTO route_municipalities (route_id, municipality_id) VALUES (?, ?)', [id, municipalityId]);
    for (const [index, highlight] of input.highlights.entries()) await connection.execute('INSERT INTO route_highlights (route_id, highlight, sort_order) VALUES (?, ?, ?)', [id, highlight, index]);
    await connection.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'create', 'route', id]);
    await connection.commit();
    return id;
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function updateRoute(id: number, input: z.infer<typeof routeSchema>, adminId: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE routes SET name=?, subtitle=?, description=?, category=?, duration_estimate=?, distance_km=?, difficulty=?, cover_image_url=?, price_suggested=?, tips=? WHERE id=? AND deleted_at IS NULL`,
      [input.name, input.subtitle || null, input.description, input.category, input.durationEstimate || null, input.distanceKm ?? null, input.difficulty, input.coverImageUrl || null, input.priceSuggested || null, input.tips || null, id]
    );
    await connection.execute('DELETE FROM route_places WHERE route_id = ?', [id]);
    await connection.execute('DELETE FROM route_municipalities WHERE route_id = ?', [id]);
    await connection.execute('DELETE FROM route_highlights WHERE route_id = ?', [id]);
    for (const [index, placeId] of input.placeIds.entries()) await connection.execute('INSERT INTO route_places (route_id, place_id, stop_order) VALUES (?, ?, ?)', [id, placeId, index]);
    for (const municipalityId of input.municipalityIds) await connection.execute('INSERT INTO route_municipalities (route_id, municipality_id) VALUES (?, ?)', [id, municipalityId]);
    for (const [index, highlight] of input.highlights.entries()) await connection.execute('INSERT INTO route_highlights (route_id, highlight, sort_order) VALUES (?, ?, ?)', [id, highlight, index]);
    await connection.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'update', 'route', id]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function deleteRoute(id: number, adminId: number) {
  await pool.execute('UPDATE routes SET deleted_at = CURRENT_TIMESTAMP(3) WHERE id = ? AND deleted_at IS NULL', [id]);
  await pool.execute('INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)', [adminId, 'delete', 'route', id]);
}