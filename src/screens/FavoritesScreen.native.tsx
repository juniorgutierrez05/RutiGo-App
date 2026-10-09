import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';

export function FavoritesScreen() {
  const { places, routes, currentUser, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const savedPlaces = places.filter((place) => currentUser?.savedPlaces.includes(place.id));
  const savedRoutes = routes.filter((route) => currentUser?.savedRoutes.includes(route.id));

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 12,
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>MI COLECCIÓN</Text>
        <Text style={styles.title}>Guardados</Text>

        <Text style={styles.section}>Lugares favoritos</Text>
        {savedPlaces.map((place) => (
          <Pressable
            key={place.id}
            style={styles.item}
            onPress={() => navigateTo('place_detail', { placeId: place.id })}
          >
            <Image source={{ uri: place.images[0] }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
              <Text style={styles.muted}>{place.municipality}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.section}>Rutas favoritas</Text>
        {savedRoutes.map((route) => (
          <Pressable
            key={route.id}
            style={styles.route}
            onPress={() => navigateTo('route_detail', { routeId: route.id })}
          >
            <Text style={styles.name} numberOfLines={1}>{route.name}</Text>
            <Text style={styles.muted}>{route.distanceKm} km · {route.durationEstimate}</Text>
          </Pressable>
        ))}

        {!savedPlaces.length && !savedRoutes.length && (
          <Text style={styles.emptyText}>Aún no tienes experiencias guardadas.</Text>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  eyebrow: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: '#1E1927', fontSize: 28, fontWeight: '900', marginTop: 4 },
  section: { color: '#1E1927', fontSize: 17, fontWeight: '900', marginTop: 22, marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    marginBottom: 10,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 62, height: 62, borderRadius: 12 },
  info: { flex: 1 },
  name: { color: '#1E1927', fontSize: 15, fontWeight: '900' },
  muted: { color: '#806F69', fontSize: 13, marginTop: 4 },
  route: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    marginBottom: 10,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: { color: '#806F69', fontSize: 14, marginTop: 14 },
});
