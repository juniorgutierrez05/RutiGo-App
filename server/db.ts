import mysql from 'mysql2/promise';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const pool = mysql.createPool({
  host: requiredEnv('MYSQL_ADDON_HOST'),
  port: Number(process.env.MYSQL_ADDON_PORT || 3306),
  database: requiredEnv('MYSQL_ADDON_DB'),
  user: requiredEnv('MYSQL_ADDON_USER'),
  password: requiredEnv('MYSQL_ADDON_PASSWORD'),
  waitForConnections: true,
  connectionLimit: 1,
  maxIdle: 1,
  idleTimeout: 60000,
  enableKeepAlive: true,
  timezone: 'Z',
});

export async function checkDatabaseConnection(): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}
