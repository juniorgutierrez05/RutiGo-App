import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';

export function SearchScreen() {
  const { places, routes, navigateTo, goBack, searchQuery, setSearchQuery, addRecentSearch, recentSearches } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(searchQuery);

  const normalized = query.trim().toLowerCase();

  const placeResults = useMemo(() => {
    if (!normalized) return [];
    return places.filter((place) =>
      `${place.name} ${place.municipality} ${place.description}`.toLowerCase().includes(normalized)
    );
  }, [places, normalized]);

  const routeResults = useMemo(() => {
    if (!normalized) return [];
    return routes.filter((route) =>
      `${route.name} ${route.description}`.toLowerCase().includes(normalized)
    );
  }, [routes, normalized]);

  const submit = () => {
    if (query.trim()) {
      setSearchQuery(query);
      addRecentSearch(query);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 10,
            paddingBottom: Math.max(insets.bottom, 12) + 84,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={28} color="#FF7A59" />
          </Pressable>
          <Text style={styles.title}>Buscar</Text>
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={20} color="#FF7A59" style={styles.inputIcon} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            placeholder="Rutas, lugares, gastronomía..."
            placeholderTextColor="#806F69"
            style={styles.input}
            returnKeyType="search"
          />
          {Boolean(query) && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#C4B7B0" />
            </Pressable>
          )}
        </View>

        {!query && (
          <>
            <Text style={styles.label}>Búsquedas recientes</Text>
            {recentSearches.map((term) => (
              <Pressable key={term} style={styles.recent} onPress={() => setQuery(term)}>
                <View style={styles.recentRow}>
                  <Ionicons name="time-outline" size={16} color="#806F69" />
                  <Text style={styles.recentText}>{term}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {Boolean(query) && (
          <>
            <Text style={styles.label}>{placeResults.length + routeResults.length} resultados</Text>
            {routeResults.map((route) => (
              <Pressable
                key={route.id}
                style={styles.result}
                onPress={() => navigateTo('route_detail', { routeId: route.id })}
              >
                <View style={styles.resultInfo}>
                  <Text style={styles.type}>RUTA</Text>
                  <Text style={styles.name}>{route.name}</Text>
                  <Text style={styles.description} numberOfLines={2}>{route.description}</Text>
                </View>
              </Pressable>
            ))}
            {placeResults.map((place) => (
              <Pressable
                key={place.id}
                style={styles.result}
                onPress={() => navigateTo('place_detail', { placeId: place.id })}
              >
                <Image
                  source={place.images[0]}
                  style={styles.thumb}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.type}>LUGAR · {place.municipality.toUpperCase()}</Text>
                  <Text style={styles.name}>{place.name}</Text>
                  <Text style={styles.description} numberOfLines={2}>{place.description}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  back: { color: '#FF7A59', fontSize: 32, marginTop: -2 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900' },
  inputWrap: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: '#1E1927', fontSize: 15 },
  label: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginTop: 22, marginBottom: 10 },
  recent: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0E4DC' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recentText: { color: '#806F69', fontSize: 14 },
  result: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: { width: 56, height: 56, borderRadius: 12 },
  resultInfo: { flex: 1 },
  type: { color: '#FF7A59', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  name: { color: '#1E1927', fontSize: 15, fontWeight: '900', marginTop: 2 },
  description: { color: '#806F69', fontSize: 12, marginTop: 2, lineHeight: 16 },
});
