import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { CategoryType } from '../types';
import { theme } from '../theme/expressiveTheme';

type ChipProps = {
  label: string;
  icon?: string;
  category?: CategoryType;
  selected?: boolean;
  onClick?: () => void;
  onClear?: () => void;
  count?: number;
  size?: 'sm' | 'md';
};

const categoryColors: Record<CategoryType, string> = {
  gastronomia: '#FF7A59',
  naturaleza: '#00AEB7',
  cultura: '#7B61FF',
  historia: '#CA9A00',
};

export function Chip({
  label,
  icon,
  category,
  selected,
  onClick,
  onClear,
  count,
  size = 'md',
}: ChipProps) {
  const color = category ? categoryColors[category] : theme.colors.primary;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: theme.isAndroid ? 0.92 : 0.96,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: theme.isAndroid ? 14 : 6, // Rebote elástico M3 Expressive
    }).start();
  };

  return (
    <Pressable
      onPress={onClick}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.base,
          size === 'sm' ? styles.small : styles.medium,
          selected
            ? { backgroundColor: color, borderColor: color }
            : styles.unselected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={[styles.text, selected && styles.selectedText]}>
          {icon ? `${icon} ` : ''}
          {label}
          {count !== undefined ? ` (${count})` : ''}
        </Text>
        {onClear && (
          <Text onPress={onClear} style={styles.close}>
            ×
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.shapes.chip,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  small: { minHeight: 36, paddingHorizontal: 14 },
  medium: { minHeight: 44, paddingHorizontal: 18 },
  unselected: {
    backgroundColor: theme.isAndroid ? '#F7EEE9' : '#FFFFFF',
    borderColor: theme.isAndroid ? '#EADBD3' : theme.colors.outline,
    ...theme.elevation.card,
  },
  text: {
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '800',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  close: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  androidPressed: {
    transform: [{ scale: 0.95 }],
  },
  iosPressed: {
    opacity: 0.8,
  },
});
