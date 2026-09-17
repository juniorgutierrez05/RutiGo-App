import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name || !email || !password || password.length < 12) {
  throw new Error('Define ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD de al menos 12 caracteres');
}

const [existing] = await pool.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
if ((existing as unknown[]).length > 0) {
  throw new Error('Ya existe un administrador. Usa el panel o un procedimiento de recuperación seguro.');
}

const passwordHash = await bcrypt.hash(password, 12);
const [result] = await pool.execute(
  "INSERT INTO users (name, email, password_hash, auth_provider, role, status) VALUES (?, ?, ?, 'local', 'admin', 'active')",
  [name, email, passwordHash]
);
const adminId = Number((result as { insertId: number }).insertId);
await pool.execute(
"INSERT INTO admin_audit_log (admin_user_id, action, entity_type, entity_id, details) VALUES (?, 'bootstrap', 'user', ?, JSON_OBJECT('source', 'create-admin-command'))",
  [adminId, adminId]
);
console.log(`Administrador creado con id ${adminId}.`);
await pool.end();