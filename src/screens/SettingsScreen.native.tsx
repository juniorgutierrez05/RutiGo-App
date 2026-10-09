import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function SettingsScreen() {
  const { goBack, locationName, setLocationName } = useApp();
  const insets = useSafeAreaInsets();

  const setting = (label: string, value: string, action: () => void) => (
    <Pressable style={styles.item} onPress={action}>
      <View style={styles.itemInfo}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
        <Text style={styles.back}>‹ Volver</Text>
      </Pressable>
      <Text style={styles.title}>Configuración</Text>
      {setting('Municipio base', locationName, () =>
        Alert.alert('Municipio base', 'Usa la ubicación actual para personalizar tus recomendaciones.')
      )}
      {setting('Notificaciones', 'Activadas', () =>
        Alert.alert('Notificaciones', 'Las notificaciones están activadas.')
      )}
      {setting('Ubicación', 'Permitir GPS', () => setLocationName('Puerto Colombia'))}
      {setting('Privacidad', 'Tus datos están protegidos', () =>
        Alert.alert('Privacidad', 'RutiGo solo utiliza tu ubicación para calcular distancias.')
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginBottom: 18 },
  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  label: { color: '#1E1927', fontSize: 15, fontWeight: '800' },
  value: { color: '#806F69', fontSize: 12, marginTop: 4 },
  arrow: { color: '#FF7A59', fontSize: 22, marginTop: -2 },
});
