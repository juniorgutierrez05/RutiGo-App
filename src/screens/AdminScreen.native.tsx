import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button.native';
import { Card } from '../components/Card.native';
import { Chip } from '../components/Chip.native';
import { Input } from './nativeShared';
import { useApp } from '../store';
import * as api from '../services/api';

type Tab = 'summary' | 'users' | 'places' | 'routes';
const categories = ['cultura', 'gastronomia', 'naturaleza', 'historia'] as const;

const emptyPlace: api.PlaceInput = {
  name: '',
  description: '',
  category: 'cultura',
  municipalityId: 0,
  latitude: '',
  longitude: '',
  address: '',
  schedule: '',
  estimatedTime: '',
  tag: '',
  priceNote: '',
  images: [],
};

const emptyRoute: api.RouteInput = {
  name: '',
  subtitle: '',
  description: '',
  category: 'cultura',
  durationEstimate: '',
  distanceKm: 0,
  difficulty: 'facil',
  coverImageUrl: '',
  priceSuggested: '',
  tips: '',
  placeIds: [],
  municipalityIds: [],
  highlights: [],
};

function placeToInput(place: ReturnType<typeof useApp>['places'][number]): api.PlaceInput {
  return {
    name: place.name,
    description: place.description,
    category: place.category,
    municipalityId: 0,
    latitude: place.location.lat,
    longitude: place.location.lng,
    address: place.address || '',
    schedule: place.schedule,
    estimatedTime: place.estimatedTime || '',
    tag: place.tag || '',
    priceNote: place.priceNote || '',
    images: place.images.map((url) => ({ url })),
  };
}

function routeToInput(route: ReturnType<typeof useApp>['routes'][number]): api.RouteInput {
  return {
    name: route.name,
    subtitle: route.subtitle || '',
    description: route.description,
    category: route.category,
    durationEstimate: route.durationEstimate,
    distanceKm: route.distanceKm,
    difficulty: route.difficulty === 'Fácil' ? 'facil' : route.difficulty === 'Avanzado' ? 'avanzado' : 'moderado',
    coverImageUrl: route.coverImageUrl,
    priceSuggested: route.priceSuggested || '',
    tips: route.tips || '',
    placeIds: route.placeIds.map(Number),
    municipalityIds: [],
    highlights: route.highlights || [],
  };
}

export function AdminScreen() {
  const { currentUser, places, routes, goBack, logout, navigateTo } = useApp();
  const [tab, setTab] = useState<Tab>('summary');
  const [users, setUsers] = useState<api.AdminUser[]>([]);
  const [municipalities, setMunicipalities] = useState<api.Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [placeForm, setPlaceForm] = useState<api.PlaceInput>(emptyPlace);
  const [routeForm, setRouteForm] = useState<api.RouteInput>(emptyRoute);
  const [editingPlace, setEditingPlace] = useState<number | null>(null);
  const [editingRoute, setEditingRoute] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [nextUsers, nextMunicipalities] = await Promise.all([
        api.getAdminUsers(),
        api.getMunicipalities(),
      ]);
      setUsers(nextUsers);
      setMunicipalities(nextMunicipalities);
      setMessage('');
    } catch (error) {
      const text = error instanceof Error ? error.message : 'No se pudo cargar el panel';
      const lower = text.toLowerCase();
      if (lower.includes('401') || lower.includes('sesión') || lower.includes('autenticación')) {
        await logout();
        navigateTo('login');
        return;
      }
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      void load();
    }
  }, [currentUser]);

  if (currentUser?.role !== 'admin') {
    return (
      <View style={styles.permissionRoot}>
        <Text style={styles.permissionTitle}>Sin permisos</Text>
        <Text style={styles.permissionBody}>No tienes permisos para acceder al panel administrativo.</Text>
        <Button fullWidth onPress={() => navigateTo('home')}>Volver al inicio</Button>
      </View>
    );
  }

  const savePlace = async () => {
    try {
      if (!placeForm.name.trim() || !placeForm.description.trim() || !placeForm.latitude || !placeForm.longitude) {
        Alert.alert('Faltan datos', 'Completa nombre, descripción, latitud y longitud.');
        return;
      }

      const input = {
        ...placeForm,
        name: placeForm.name.trim(),
        description: placeForm.description.trim(),
        municipalityId: Number(placeForm.municipalityId),
        latitude: Number(placeForm.latitude),
        longitude: Number(placeForm.longitude),
      };

      if (editingPlace) await api.updatePlace(editingPlace, input);
      else await api.createPlace(input);

      setMessage('Lugar guardado correctamente');
      setPlaceForm(emptyPlace);
      setEditingPlace(null);
      setImageUrl('');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el lugar');
    }
  };

  const saveRoute = async () => {
    try {
      if (!routeForm.name.trim() || !routeForm.description.trim()) {
        Alert.alert('Faltan datos', 'Completa nombre y descripción de la ruta.');
        return;
      }

      const input = {
        ...routeForm,
        name: routeForm.name.trim(),
        description: routeForm.description.trim(),
        placeIds: routeForm.placeIds.map(Number),
        municipalityIds: routeForm.municipalityIds.map(Number),
        distanceKm: Number(routeForm.distanceKm || 0),
      };

      if (editingRoute) await api.updateRoute(editingRoute, input);
      else await api.createRoute(input);

      setMessage('Ruta guardada correctamente');
      setRouteForm(emptyRoute);
      setEditingRoute(null);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la ruta');
    }
  };

  const toggleUser = async (user: api.AdminUser) => {
    try {
      if (user.status === 'active') await api.blockUser(user.id, 'Bloqueado desde panel administrativo');
      else await api.unblockUser(user.id);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el usuario');
    }
  };

  const placeOptions = useMemo(() => places.map((place) => ({
    id: place.id,
    name: place.name,
  })), [places]);

  const renderSummary = () => (
    <View style={styles.grid}>
      <StatCard label="Usuarios" value={String(users.length)} />
      <StatCard label="Lugares" value={String(places.length)} />
      <StatCard label="Rutas" value={String(routes.length)} />
      <StatCard label="Bloqueados" value={String(users.filter((user) => user.status === 'blocked').length)} />
    </View>
  );

  const renderUsers = () => (
    <View style={styles.sectionList}>
      {users.map((user) => (
        <Card key={user.id} padding="md" rounded="2xl">
          <View style={styles.userRow}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userRole}>{user.status === 'active' ? 'Activo' : 'Bloqueado'} · {user.role}</Text>
            </View>
            {user.role !== 'admin' && (
              <Button fullWidth={false} variant={user.status === 'active' ? 'outline' : 'secondary'} onPress={() => void toggleUser(user)}>
                {user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
              </Button>
            )}
          </View>
        </Card>
      ))}
    </View>
  );

  const renderPlaces = () => (
    <View style={styles.formSection}>
      <Card padding="lg" rounded="2xl">
        <Text style={styles.formTitle}>{editingPlace ? 'Editar lugar' : 'Nuevo lugar'}</Text>

        <Input label="Nombre" value={placeForm.name} onChangeText={(value) => setPlaceForm({ ...placeForm, name: value })} placeholder="Nombre del lugar" />
        <Input label="Descripción" value={placeForm.description} onChangeText={(value) => setPlaceForm({ ...placeForm, description: value })} placeholder="Descripción" multiline numberOfLines={4} />

        <View style={styles.twoCols}>
          <View style={styles.column}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chipWrap}>
              {categories.map((category) => (
                <Chip key={category} label={category} category={category} selected={placeForm.category === category} onClick={() => setPlaceForm({ ...placeForm, category })} size="sm" />
              ))}
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Municipio</Text>
            <View style={styles.pickerBox}>
              {municipalities.map((municipality) => (
                <Pressable
                  key={municipality.id}
                  style={[styles.optionRow, placeForm.municipalityId === municipality.id && styles.optionSelected]}
                  onPress={() => setPlaceForm({ ...placeForm, municipalityId: municipality.id })}
                >
                  <Text style={styles.optionText}>{municipality.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.twoCols}>
          <Input
            label="Latitud"
            value={placeForm.latitude === '' ? '' : String(placeForm.latitude)}
            onChangeText={(value) => setPlaceForm({ ...placeForm, latitude: value === '' ? '' : Number(value) })}
            keyboardType="decimal-pad"
            placeholder="10.9876"
          />
          <Input
            label="Longitud"
            value={placeForm.longitude === '' ? '' : String(placeForm.longitude)}
            onChangeText={(value) => setPlaceForm({ ...placeForm, longitude: value === '' ? '' : Number(value) })}
            keyboardType="decimal-pad"
            placeholder="-74.7889"
          />
        </View>

        <Input label="Dirección" value={placeForm.address || ''} onChangeText={(value) => setPlaceForm({ ...placeForm, address: value })} placeholder="Dirección" />
        <Input label="Horario" value={placeForm.schedule || ''} onChangeText={(value) => setPlaceForm({ ...placeForm, schedule: value })} placeholder="Horario" />
        <Input label="Tiempo estimado" value={placeForm.estimatedTime || ''} onChangeText={(value) => setPlaceForm({ ...placeForm, estimatedTime: value })} placeholder="Ej. 45 min" />
        <Input label="Tag" value={placeForm.tag || ''} onChangeText={(value) => setPlaceForm({ ...placeForm, tag: value })} placeholder="Tag" />
        <Input label="Precio o nota" value={placeForm.priceNote || ''} onChangeText={(value) => setPlaceForm({ ...placeForm, priceNote: value })} placeholder="Nota de precio" />

        <View style={styles.imageAddRow}>
          <View style={styles.imageInputWrap}>
            <Input label="URL de imagen" value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
          </View>
          <Button
            onPress={() => {
              const trimmed = imageUrl.trim();
              if (!trimmed) return;
              setPlaceForm({ ...placeForm, images: [...placeForm.images, { url: trimmed }] });
              setImageUrl('');
            }}
          >
            Agregar
          </Button>
        </View>

        {placeForm.images.length > 0 && (
          <View style={styles.tagList}>
            {placeForm.images.map((image, index) => (
              <Pressable key={`${image.url}-${index}`} style={styles.tag} onPress={() => setPlaceForm({ ...placeForm, images: placeForm.images.filter((_, i) => i !== index) })}>
                <Text style={styles.tagText}>{image.url.slice(0, 22)}...</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <Button onPress={savePlace}>{editingPlace ? 'Guardar cambios' : 'Crear lugar'}</Button>
          {editingPlace && (
            <Button variant="outline" onPress={() => { setEditingPlace(null); setPlaceForm(emptyPlace); }}>
              Cancelar
            </Button>
          )}
        </View>
      </Card>

      <View style={styles.sectionList}>
        {places.map((place) => (
          <Card key={place.id} padding="md" rounded="2xl">
            <View style={styles.listRow}>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{place.name}</Text>
                <Text style={styles.listMeta}>{place.municipality} · {place.category}</Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable onPress={() => { setEditingPlace(Number(place.id)); setPlaceForm({ ...placeToInput(place), municipalityId: municipalities.find((m) => m.name === place.municipality)?.id || 0 }); }}>
                  <Text style={styles.actionIcon}>✎</Text>
                </Pressable>
                <Pressable onPress={() => void api.deletePlace(Number(place.id)).then(load)}>
                  <Text style={[styles.actionIcon, styles.deleteIcon]}>🗑</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );

  const renderRoutes = () => (
    <View style={styles.formSection}>
      <Card padding="lg" rounded="2xl">
        <Text style={styles.formTitle}>{editingRoute ? 'Editar ruta' : 'Nueva ruta'}</Text>

        <Input label="Nombre" value={routeForm.name} onChangeText={(value) => setRouteForm({ ...routeForm, name: value })} placeholder="Nombre de la ruta" />
        <Input label="Subtítulo" value={routeForm.subtitle || ''} onChangeText={(value) => setRouteForm({ ...routeForm, subtitle: value })} placeholder="Subtítulo" />
        <Input label="Descripción" value={routeForm.description} onChangeText={(value) => setRouteForm({ ...routeForm, description: value })} placeholder="Descripción" multiline numberOfLines={4} />

        <View style={styles.twoCols}>
          <View style={styles.column}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chipWrap}>
              {categories.map((category) => (
                <Chip key={category} label={category} category={category} selected={routeForm.category === category} onClick={() => setRouteForm({ ...routeForm, category })} size="sm" />
              ))}
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Dificultad</Text>
            <View style={styles.chipWrap}>
              {['facil', 'moderado', 'avanzado'].map((difficulty) => (
                <Chip key={difficulty} label={difficulty} selected={routeForm.difficulty === difficulty} onClick={() => setRouteForm({ ...routeForm, difficulty: difficulty as api.RouteInput['difficulty'] })} size="sm" />
              ))}
            </View>
          </View>
        </View>

        <Input label="Duración estimada" value={routeForm.durationEstimate} onChangeText={(value) => setRouteForm({ ...routeForm, durationEstimate: value })} placeholder="Ej. 3 horas" />
        <Input label="Distancia (km)" value={String(routeForm.distanceKm || '')} onChangeText={(value) => setRouteForm({ ...routeForm, distanceKm: Number(value || 0) })} keyboardType="numeric" placeholder="12" />
        <Input label="Imagen de portada" value={routeForm.coverImageUrl} onChangeText={(value) => setRouteForm({ ...routeForm, coverImageUrl: value })} placeholder="https://..." />
        <Input label="Precio sugerido" value={routeForm.priceSuggested || ''} onChangeText={(value) => setRouteForm({ ...routeForm, priceSuggested: value })} placeholder="Precio sugerido" />
        <Input label="Tips" value={routeForm.tips || ''} onChangeText={(value) => setRouteForm({ ...routeForm, tips: value })} placeholder="Consejos para la ruta" multiline numberOfLines={3} />

        <Text style={styles.label}>Municipios</Text>
        <View style={styles.chipWrap}>
          {municipalities.map((municipality) => (
            <Chip key={municipality.id} label={municipality.name} selected={routeForm.municipalityIds.includes(municipality.id)} onClick={() => {
              const exists = routeForm.municipalityIds.includes(municipality.id);
              setRouteForm({
                ...routeForm,
                municipalityIds: exists ? routeForm.municipalityIds.filter((id) => id !== municipality.id) : [...routeForm.municipalityIds, municipality.id],
              });
            }} size="sm" />
          ))}
        </View>

        <Text style={styles.label}>Paradas</Text>
        <View style={styles.chipWrap}>
          {placeOptions.map((place) => (
            <Chip key={place.id} label={place.name} selected={routeForm.placeIds.includes(Number(place.id))} onClick={() => {
              const id = Number(place.id);
              const exists = routeForm.placeIds.includes(id);
              setRouteForm({
                ...routeForm,
                placeIds: exists ? routeForm.placeIds.filter((value) => value !== id) : [...routeForm.placeIds, id],
              });
            }} size="sm" />
          ))}
        </View>

        <Input label="Highlights" value={routeForm.highlights?.join(', ') || ''} onChangeText={(value) => setRouteForm({ ...routeForm, highlights: value.split(',').map((item) => item.trim()).filter(Boolean) })} placeholder="Punto 1, Punto 2" />

        <View style={styles.buttonRow}>
          <Button onPress={saveRoute}>{editingRoute ? 'Guardar cambios' : 'Crear ruta'}</Button>
          {editingRoute && (
            <Button variant="outline" onPress={() => { setEditingRoute(null); setRouteForm(emptyRoute); }}>
              Cancelar
            </Button>
          )}
        </View>
      </Card>

      <View style={styles.sectionList}>
        {routes.map((route) => (
          <Card key={route.id} padding="md" rounded="2xl">
            <View style={styles.listRow}>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{route.name}</Text>
                <Text style={styles.listMeta}>{route.category} · {route.placeIds.length} paradas</Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable onPress={() => { setEditingRoute(Number(route.id)); setRouteForm({ ...routeToInput(route), municipalityIds: route.municipalities.map((name) => municipalities.find((municipality) => municipality.name === name)?.id || 0).filter(Boolean) }); }}>
                  <Text style={styles.actionIcon}>✎</Text>
                </Pressable>
                <Pressable onPress={() => void api.deleteRoute(Number(route.id)).then(load)}>
                  <Text style={[styles.actionIcon, styles.deleteIcon]}>🗑</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={goBack}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
        <Text style={styles.eyebrow}>PANEL ADMIN</Text>
        <Text style={styles.title}>Administración</Text>
        <Text style={styles.subtitle}>Gestiona usuarios, lugares y rutas reales del backend.</Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.tabRow}>
          {(['summary', 'users', 'places', 'routes'] as Tab[]).map((item) => (
            <Pressable key={item} style={[styles.tab, tab === item && styles.activeTab]} onPress={() => setTab(item)}>
              <Text style={[styles.tabText, tab === item && styles.activeTabText]}>
                {item === 'summary' ? 'Resumen' : item === 'users' ? 'Usuarios' : item === 'places' ? 'Lugares' : 'Rutas'}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? <Text style={styles.loading}>Cargando datos reales...</Text> : (
          <>
            {tab === 'summary' && renderSummary()}
            {tab === 'users' && renderUsers()}
            {tab === 'places' && renderPlaces()}
            {tab === 'routes' && renderRoutes()}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="md" rounded="2xl">
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: '#FF7A59', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  eyebrow: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: '#1E1927', fontSize: 29, fontWeight: '900', marginTop: 5 },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginTop: 8 },
  message: { marginTop: 14, padding: 12, borderRadius: 12, backgroundColor: '#FFF0EB', color: '#7C3427', fontWeight: '700' },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18, marginBottom: 18 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0E4DC' },
  activeTab: { backgroundColor: '#FF7A59', borderColor: '#FF7A59' },
  tabText: { color: '#1E1927', fontWeight: '800', fontSize: 12 },
  activeTabText: { color: '#FFF' },
  loading: { color: '#806F69', fontSize: 15, fontWeight: '700', marginTop: 18 },
  permissionRoot: { flex: 1, backgroundColor: '#FFFCF8', justifyContent: 'center', padding: 24 },
  permissionTitle: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginBottom: 8 },
  permissionBody: { color: '#806F69', fontSize: 14, marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  statValue: { color: '#FF7A59', fontSize: 28, fontWeight: '900' },
  statLabel: { color: '#806F69', fontSize: 12, marginTop: 3 },
  sectionList: { gap: 10 },
  userRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  userInfo: { flex: 1 },
  userName: { color: '#1E1927', fontSize: 16, fontWeight: '900' },
  userEmail: { color: '#806F69', fontSize: 12, marginTop: 4 },
  userRole: { color: '#00AEB7', fontSize: 11, fontWeight: '800', marginTop: 6 },
  formSection: { gap: 16 },
  formTitle: { color: '#1E1927', fontSize: 20, fontWeight: '900', marginBottom: 12 },
  twoCols: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 8 },
  label: { color: '#1E1927', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerBox: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#F0E4DC', paddingVertical: 8 },
  optionRow: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5EEE9' },
  optionSelected: { backgroundColor: '#FFF0EB' },
  optionText: { color: '#1E1927', fontSize: 12, fontWeight: '700' },
  imageAddRow: { marginTop: 6 },
  imageInputWrap: { marginBottom: 10 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { backgroundColor: '#FFF0EB', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  tagText: { color: '#7C3427', fontSize: 11, fontWeight: '800' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  listInfo: { flex: 1 },
  listTitle: { color: '#1E1927', fontSize: 15, fontWeight: '900' },
  listMeta: { color: '#806F69', fontSize: 11, marginTop: 4 },
  rowActions: { flexDirection: 'row', gap: 10 },
  actionIcon: { color: '#FF7A59', fontSize: 23 },
  deleteIcon: { color: '#D14343' },
});
