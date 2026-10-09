import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function NotificationsScreen() {
  const { notifications, goBack } = useApp();
  const insets = useSafeAreaInsets();

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
      <Text style={styles.title}>Notificaciones</Text>
      {notifications.length ? (
        notifications.map((notification) => (
          <View key={notification.id} style={styles.card}>
            <Text style={styles.heading}>{notification.title}</Text>
            <Text style={styles.body}>{notification.body}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No tienes notificaciones nuevas.</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: { color: '#1E1927', fontSize: 15, fontWeight: '900' },
  body: { color: '#806F69', fontSize: 13, lineHeight: 19, marginTop: 5 },
  emptyText: { color: '#806F69', fontSize: 14, marginTop: 12 },
});
