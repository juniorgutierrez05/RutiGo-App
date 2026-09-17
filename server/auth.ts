import bcrypt from 'bcryptjs';
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { pool } from './db.js';

export const localRegisterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  homeCity: z.string().trim().max(100).optional(),
});

export const localLoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});

export const socialLoginSchema = z.object({
  idToken: z.string().min(20),
  homeCity: z.string().trim().max(100).optional(),
});

type Provider = 'google' | 'apple';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: 'tourist' | 'admin';
  status: 'active' | 'blocked';
  home_city: string | null;
  avatar_url: string | null;
  created_at: Date;
};

export type AuthenticatedRequest = Request & {
  user?: { id: number; role: 'tourist' | 'admin'; status: 'active' | 'blocked' };
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function jwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
  }
  return new TextEncoder().encode(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, jwtSecret(), { algorithms: ['HS256'] });
  const id = Number(payload.sub);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Sesión inválida');
  return { id, role: payload.role === 'admin' ? 'admin' as const : 'tourist' as const };
}

export async function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const header = request.header('authorization');
  if (!header?.startsWith('Bearer ')) return response.status(401).json({ message: 'Autenticación requerida' });
  try {
    const session = await verifySession(header.slice(7));
    const [rows] = await pool.execute('SELECT id, role, status FROM users WHERE id = ? LIMIT 1', [session.id]);
    const user = (rows as { id: number; role: 'tourist' | 'admin'; status: 'active' | 'blocked' }[])[0];
    if (!user || user.status !== 'active') return response.status(401).json({ message: 'Sesión inválida o cuenta bloqueada' });
    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: 'Sesión inválida' });
  }
}

export function requireAdmin(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  if (request.user?.role !== 'admin') return response.status(403).json({ message: 'Permisos de administrador requeridos' });
  return next();
}

async function issueSession(user: UserRow): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(jwtSecret());
}

async function getUserById(id: number): Promise<UserRow> {
  const [rows] = await pool.execute(
    `SELECT id, name, email, role, status, home_city, avatar_url, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  const user = (rows as UserRow[])[0];
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

async function toAuthResponse(user: UserRow) {
  const [favorites] = await pool.execute(
    'SELECT place_id, route_id FROM user_favorites WHERE user_id = ?',
    [user.id]
  );
  const savedPlaces: string[] = [];
  const savedRoutes: string[] = [];
  for (const favorite of favorites as { place_id: number | null; route_id: number | null }[]) {
    if (favorite.place_id !== null) savedPlaces.push(String(favorite.place_id));
    if (favorite.route_id !== null) savedRoutes.push(String(favorite.route_id));
  }
  return {
    token: await issueSession(user),
    user: {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      homeCity: user.home_city,
      avatarUrl: user.avatar_url,
      savedPlaces,
      savedRoutes,
      createdAt: user.created_at,
    },
  };
}

export async function registerLocal(input: z.infer<typeof localRegisterSchema>) {
  const email = normalizeEmail(input.email);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, auth_provider, home_city)
     VALUES (?, ?, ?, 'local', NULLIF(?, ''))`,
    [input.name.trim(), email, passwordHash, input.homeCity?.trim() || '']
  );
  return toAuthResponse(await getUserById(Number((result as { insertId: number }).insertId)));
}

export async function loginLocal(input: z.infer<typeof localLoginSchema>) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, role, status, home_city, avatar_url, created_at
     FROM users WHERE email = ? LIMIT 1`,
    [normalizeEmail(input.email)]
  );
  const user = (rows as (UserRow & { password_hash: string | null })[])[0];
  if (!user || !user.password_hash || !(await bcrypt.compare(input.password, user.password_hash))) {
    throw new Error('Credenciales inválidas');
  }
  if (user.status !== 'active') throw new Error('La cuenta está bloqueada');
  await pool.execute('UPDATE users SET last_login_at = CURRENT_TIMESTAMP(3) WHERE id = ?', [user.id]);
  return toAuthResponse(user);
}

async function verifyProviderToken(provider: Provider, idToken: string) {
  const isGoogle = provider === 'google';
  const issuer = isGoogle ? 'https://accounts.google.com' : 'https://appleid.apple.com';
  const audienceConfig: string | undefined = process.env[isGoogle ? 'GOOGLE_CLIENT_IDS' : 'APPLE_CLIENT_IDS']
    || process.env[isGoogle ? 'GOOGLE_CLIENT_ID' : 'APPLE_CLIENT_ID'];
  const audience = audienceConfig?.split(',').map((value) => value.trim()).filter(Boolean);
  if (!audience?.length) {
    throw new Error(`Falta configurar ${isGoogle ? 'GOOGLE_CLIENT_IDS' : 'APPLE_CLIENT_IDS'}`);
  }
  const jwks = createRemoteJWKSet(
    new URL(isGoogle ? 'https://www.googleapis.com/oauth2/v3/certs' : 'https://appleid.apple.com/auth/keys')
  );
  const { payload } = await jwtVerify(idToken, jwks, { issuer, audience });
  if (!payload.sub) throw new Error('Token social sin identificador');
  return {
    subject: payload.sub,
    email: typeof payload.email === 'string' ? normalizeEmail(payload.email) : null,
    name: typeof payload.name === 'string' ? payload.name : 'Explorador RutiGo',
    avatarUrl: typeof payload.picture === 'string' ? payload.picture : null,
  };
}

export async function loginSocial(
  provider: Provider,
  input: z.infer<typeof socialLoginSchema>
) {
  const profile = await verifyProviderToken(provider, input.idToken);
  const [existingRows] = await pool.execute(
    `SELECT id, name, email, role, status, home_city, avatar_url, created_at
     FROM users WHERE auth_provider = ? AND provider_subject = ? LIMIT 1`,
    [provider, profile.subject]
  );
  let user = (existingRows as UserRow[])[0];
  if (!user) {
    if (!profile.email) throw new Error('El proveedor no entregó un correo electrónico');
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, auth_provider, provider_subject, home_city, avatar_url)
       VALUES (?, ?, ?, ?, NULLIF(?, ''), ?)`,
      [profile.name, profile.email, provider, profile.subject, input.homeCity?.trim() || '', profile.avatarUrl]
    );
    user = await getUserById(Number((result as { insertId: number }).insertId));
  }
  if (user.status !== 'active') throw new Error('La cuenta está bloqueada');
  await pool.execute('UPDATE users SET last_login_at = CURRENT_TIMESTAMP(3) WHERE id = ?', [user.id]);
  return toAuthResponse(user);
}