import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';

export function ProfileScreen() {
  const { currentUser, navigateTo, logout } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 12,
            paddingBottom: Math.max(insets.bottom, 12) + 84,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentUser?.name?.[0]?.toUpperCase() || 'R'}</Text>
        </View>
        <Text style={styles.title}>{currentUser?.name || 'Viajero RutiGo'}</Text>
        <Text style={styles.email}>{currentUser?.email || 'Explora como invitado'}</Text>

        <View style={styles.stats}>
          <Stat value={`${currentUser?.savedRoutes?.length || 0}`} label="rutas guardadas" />
          <Stat value={`${currentUser?.savedPlaces?.length || 0}`} label="lugares guardados" />
        </View>

        <View style={styles.menuGroup}>
          <Menu icon="heart-outline" label="Mis favoritos" onPress={() => navigateTo('favorites')} />
          <Menu icon="notifications-outline" label="Notificaciones" onPress={() => navigateTo('notifications')} />
          <Menu icon="settings-outline" label="Configuración" onPress={() => navigateTo('settings')} />
          {currentUser?.role === 'admin' && (
            <Menu icon="shield-checkmark-outline" label="Administración" onPress={() => navigateTo('admin')} />
          )}
        </View>

        {currentUser ? (
          <Pressable style={styles.logout} onPress={() => logout()} hitSlop={6}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.loginBtn} onPress={() => navigateTo('login')} hitSlop={6}>
            <Text style={styles.loginBtnText}>Iniciar sesión</Text>
          </Pressable>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Menu({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.menu} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#E60124" />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#C4B7B0" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16, alignItems: 'center' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FDE8EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#E60124',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: { color: '#E60124', fontSize: 36, fontWeight: '900' },
  title: { color: '#1E1927', fontSize: 24, fontWeight: '900', marginTop: 12 },
  email: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  stats: { flexDirection: 'row', width: '100%', gap: 10, marginVertical: 20 },
  stat: {
    flex: 1,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { color: '#E60124', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#6B7280', fontSize: 11, marginTop: 4, fontWeight: '700' },
  menuGroup: { width: '100%', marginBottom: 8 },
  menu: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { color: '#1E1927', fontSize: 15, fontWeight: '800' },
  logout: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E60124',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
  },
  logoutText: { color: '#E60124', fontWeight: '900', fontSize: 14 },
  loginBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: '#E60124',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#E60124',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  loginBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
});
