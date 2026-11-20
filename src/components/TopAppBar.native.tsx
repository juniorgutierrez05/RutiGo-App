import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';
import { theme } from '../theme/expressiveTheme';

type TopAppBarProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  trailing?: React.ReactNode;
};

export function TopAppBar({
  title = 'Barranquilla & Atlántico',
  subtitle = 'Guía costera activa',
  showBack,
  onBack,
  showNotifications = true,
  trailing,
}: TopAppBarProps) {
  const { navigateTo, goBack, unreadNotifsCount } = useApp();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, 20) + 6;

  return (
    <View style={[styles.bar, { paddingTop: topPadding }]}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable style={styles.circle} onPress={onBack || goBack} hitSlop={6}>
            <Ionicons name="chevron-back" size={24} color="#1E1927" />
          </Pressable>
        ) : (
          <Pressable style={styles.avatar} onPress={() => navigateTo('profile')} hitSlop={6}>
            <Image
              source={IMAGES.brand.officialIcon}
              style={styles.image}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </Pressable>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>● {subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.right}>
        {trailing}
        <Pressable
          style={[styles.circle, styles.rutiChatButton]}
          onPress={() => navigateTo('chat')}
          hitSlop={6}
          accessibilityLabel="Hablar con Ruti"
        >
          <Image
            source={IMAGES.brand.officialIcon}
            style={styles.rutiIcon}
            contentFit="cover"
          />
        </Pressable>
        {showNotifications && (
          <Pressable style={styles.circle} onPress={() => navigateTo('notifications')} hitSlop={6}>
            <Ionicons name="notifications-outline" size={20} color="#E60124" />
            {unreadNotifsCount > 0 && <View style={styles.dot} />}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 8,
  },
  titleWrap: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE8EA',
    padding: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  back: {
    color: '#1E1927',
    fontSize: 28,
    marginTop: -2,
  },
  bell: {
    color: '#E60124',
    fontSize: 22,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E60124',
  },
  rutiChatButton: {
    backgroundColor: '#FDE8EA',
    borderColor: '#E60124',
    borderWidth: 1.5,
  },
  rutiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  title: {
    color: '#E60124',
    fontSize: 15.5,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
});
