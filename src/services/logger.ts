/**
 * Client Logger and Telemetry Service for RutiGo
 * Sends diagnostics and error events to the backend server in real-time
 */
import { Platform } from 'react-native';

const configuredApiUrl =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3001';
const API_URL = configuredApiUrl.replace(/\/$/, '');

type LogLevel = 'info' | 'warn' | 'error';

export function logEvent(
  level: LogLevel,
  tag: string,
  message: string,
  details?: Record<string, unknown> | Error | string
) {
  const meta = {
    platform: Platform.OS,
    timestamp: new Date().toISOString(),
    ...(details instanceof Error ? { error: details.message, stack: details.stack } : typeof details === 'object' ? details : { info: details }),
  };

  // Log local en Metro / consola móvil
  if (level === 'error') {
    console.error(`[${tag}] ${message}`, meta);
  } else if (level === 'warn') {
    console.warn(`[${tag}] ${message}`, meta);
  } else {
    console.log(`[${tag}] ${message}`, meta);
  }

  // Envío al servidor backend para auditoría centralizada
  fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,
      tag,
      message,
      details: meta,
    }),
  }).catch(() => {
    // Silencioso para no interrumpir el flujo del usuario si el servidor no responde
  });
}
