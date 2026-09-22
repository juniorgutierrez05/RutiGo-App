import { Place, Route, Review, NotificationItem, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configuredApiUrl =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://192.168.1.38:3001';
const API_URL = configuredApiUrl.replace(/\/$/, '');

const USER_KEY = 'rutigo_user';
const TOKEN_KEY = 'rutigo_auth_token';
type AuthApiResponse = { token: string; user: User };

async function storedUser(): Promise<User | null> {
  if (!(await AsyncStorage.getItem(TOKEN_KEY))) return null;
  try { const value = await AsyncStorage.getItem(USER_KEY); return value ? JSON.parse(value) : null; } catch { return null; }
}
async function saveSession(data: AuthApiResponse): Promise<User> {
  await Promise.all([
    AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
    AsyncStorage.setItem(TOKEN_KEY, data.token),
  ]);
  return data.user;
}
function getToken(): Promise<string | null> { return AsyncStorage.getItem(TOKEN_KEY); }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const authToken = await getToken();
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`No se pudo conectar con RutiGo API en ${API_URL}. Comprueba que el servidor esté activo y que el teléfono esté en la misma red Wi-Fi.`);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || `API error ${response.status}`);
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

function jsonValue<T>(value: T | string | null | undefined, fallback: T): T {
  if (typeof value !== 'string') return value ?? fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}
function mapPlace(value: any): Place {
  const images = jsonValue<any[]>(value.images, []);
  return { id: String(value.id), name: value.name, description: value.description, category: value.category, municipality: value.municipality || '', location: { lat: Number(value.latitude), lng: Number(value.longitude) }, address: value.address || undefined, schedule: value.schedule || '', images: images.map((image: any) => image.url || image), avgRating: Number(value.average_rating || 0), reviewCount: Number(value.review_count || 0), estimatedTime: value.estimated_time || undefined, tag: value.tag || undefined, priceNote: value.price_note || undefined, createdAt: value.created_at };
}
function mapRoute(value: any): Route {
  const municipalities = jsonValue<string[]>(value.municipalities, []);
  const placeIds = jsonValue<number[]>(value.place_ids, []);
  const highlights = jsonValue<string[]>(value.highlights, []);
  return { id: String(value.id), name: value.name, subtitle: value.subtitle || undefined, description: value.description, category: value.category, municipalities, durationEstimate: value.duration_estimate || '', distanceKm: Number(value.distance_km || 0), difficulty: value.difficulty === 'facil' ? 'Fácil' : value.difficulty === 'avanzado' ? 'Avanzado' : 'Moderado', coverImageUrl: value.cover_image_url || '', placeIds: placeIds.map((id) => String(id)), avgRating: Number(value.average_rating || 0), reviewCount: Number(value.review_count || 0), priceSuggested: value.price_suggested || undefined, highlights, tips: value.tips || undefined, createdAt: value.created_at };
}

export async function loginWithEmail(email: string, password: string): Promise<User> { return saveSession(await request<AuthApiResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })); }
export async function registerWithEmail(name: string, email: string, password: string, homeCity: string): Promise<User> { return saveSession(await request<AuthApiResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, homeCity }) })); }
export async function loginWithGoogle(idToken: string): Promise<User> { return saveSession(await request<AuthApiResponse>('/api/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) })); }
export async function logoutUser(): Promise<void> {
  await Promise.all([AsyncStorage.removeItem(USER_KEY), AsyncStorage.removeItem(TOKEN_KEY)]);
}
export async function getCurrentUser(): Promise<User | null> { return storedUser(); }
export async function validateSession(): Promise<void> { await request('/api/me'); }
export async function getPlaces(): Promise<Place[]> { return (await request<any[]>('/api/places?limit=100')).map(mapPlace); }
export async function getRoutes(): Promise<Route[]> { return (await request<any[]>('/api/routes?limit=100')).map(mapRoute); }
export async function getPlaceById(id: string): Promise<Place | undefined> { return (await getPlaces()).find((place) => place.id === id); }
export async function getRouteById(id: string): Promise<Route | undefined> { return (await getRoutes()).find((route) => route.id === id); }

export async function getReviews(placeOrRouteId?: string): Promise<Review[]> {
  const query = placeOrRouteId ? `?placeId=${encodeURIComponent(placeOrRouteId)}` : '';
  return (await request<any[]>(`/api/reviews${query}`)).map((value) => ({ id: String(value.id), placeId: value.place_id ? String(value.place_id) : undefined, routeId: value.route_id ? String(value.route_id) : undefined, userId: String(value.user_id), userName: value.user_name, userAvatar: value.user_avatar || undefined, rating: Number(value.rating), comment: value.comment, photoUrl: value.photo_url || undefined, createdAt: value.created_at }));
}
export async function createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const value = await request<any>('/api/reviews', { method: 'POST', body: JSON.stringify({ placeId: data.placeId ? Number(data.placeId) : undefined, routeId: data.routeId ? Number(data.routeId) : undefined, rating: data.rating, comment: data.comment, photoUrl: data.photoUrl }) });
  return { id: String(value.id), placeId: value.place_id ? String(value.place_id) : undefined, routeId: value.route_id ? String(value.route_id) : undefined, userId: String(value.user_id), userName: data.userName, userAvatar: data.userAvatar, rating: Number(value.rating), comment: value.comment, photoUrl: value.photo_url || undefined, createdAt: value.created_at };
}
export async function updateReview(id: string, rating: number, comment: string): Promise<Review> { return request<Review>(`/api/reviews/${id}`, { method: 'PATCH', body: JSON.stringify({ rating, comment }) }); }
export async function deleteReview(id: string): Promise<void> { await request(`/api/reviews/${id}`, { method: 'DELETE' }); }

export async function toggleFavorite(type: 'route' | 'place', id: string, user: User): Promise<User> {
  const saved = type === 'route' ? user.savedRoutes : user.savedPlaces;
  const exists = saved.includes(id);
  if (exists) await request(`/api/favorites/${type}/${id}`, { method: 'DELETE' }); else await request('/api/favorites', { method: 'POST', body: JSON.stringify({ type, id: Number(id) }) });
  const updated = { ...user, ...(type === 'route' ? { savedRoutes: exists ? saved.filter((item) => item !== id) : [...saved, id] } : { savedPlaces: exists ? saved.filter((item) => item !== id) : [...saved, id] }) };
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
export async function getNotifications(): Promise<NotificationItem[]> { return (await request<any[]>('/api/notifications')).map((value) => ({ id: String(value.id), userId: String(value.user_id), type: value.type, title: value.title, body: value.body, read: Boolean(value.is_read), relatedId: value.related_id ? String(value.related_id) : undefined, createdAt: value.created_at })); }
export async function markNotificationAsRead(id: string): Promise<void> { await request(`/api/notifications/${id}/read`, { method: 'PATCH' }); }

export type AdminUser = { id: number; name: string; email: string; role: 'tourist' | 'admin'; status: 'active' | 'blocked'; home_city: string | null; auth_provider: string; created_at: string; last_login_at: string | null };
export type Municipality = { id: number; name: string; department: string; latitude: string; longitude: string };
export type PlaceInput = { name: string; description: string; category: string; municipalityId: number; latitude: number | ''; longitude: number | ''; address?: string; schedule?: string; estimatedTime?: string; tag?: string; priceNote?: string; images: { url: string; altText?: string }[] };
export type RouteInput = { name: string; subtitle?: string; description: string; category: string; durationEstimate?: string; distanceKm?: number; difficulty: 'facil' | 'moderado' | 'avanzado'; coverImageUrl?: string; priceSuggested?: string; tips?: string; placeIds: number[]; municipalityIds: number[]; highlights: string[] };
export async function getAdminUsers(): Promise<AdminUser[]> { return request<AdminUser[]>('/api/admin/users'); }
export async function blockUser(id: number, reason?: string): Promise<void> { await request(`/api/admin/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ reason }) }); }
export async function unblockUser(id: number): Promise<void> { await request(`/api/admin/users/${id}/unblock`, { method: 'PATCH' }); }
export async function getMunicipalities(): Promise<Municipality[]> { return request<Municipality[]>('/api/municipalities'); }
export async function createPlace(input: PlaceInput): Promise<number> { return (await request<{ id: number }>('/api/admin/places', { method: 'POST', body: JSON.stringify(input) })).id; }
export async function updatePlace(id: number, input: PlaceInput): Promise<void> { await request(`/api/admin/places/${id}`, { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deletePlace(id: number): Promise<void> { await request(`/api/admin/places/${id}`, { method: 'DELETE' }); }
export async function createRoute(input: RouteInput): Promise<number> { return (await request<{ id: number }>('/api/admin/routes', { method: 'POST', body: JSON.stringify(input) })).id; }
export async function updateRoute(id: number, input: RouteInput): Promise<void> { await request(`/api/admin/routes/${id}`, { method: 'PATCH', body: JSON.stringify(input) }); }
export async function deleteRoute(id: number): Promise<void> { await request(`/api/admin/routes/${id}`, { method: 'DELETE' }); }
