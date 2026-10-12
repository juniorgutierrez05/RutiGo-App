import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { theme } from '../theme/expressiveTheme';

type CardProps = {
  children: React.ReactNode;
  variant?: 'white' | 'ambient' | 'hero' | 'chip' | 'tonal';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
  onPress?: () => void;
};

export function Card({
  children,
  variant = 'white',
  rounded = '2xl',
  padding = 'md',
  interactive,
  onPress,
}: CardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: theme.isAndroid ? 0.96 : 0.98,
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
      bounciness: theme.isAndroid ? 10 : 5, // Rebote físico M3 Expressive
    }).start();
  };

  const content = (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[rounded],
        styles[padding === 'lg' ? 'largePadding' : padding],
      ]}
    >
      {children}
    </View>
  );

  return interactive || onPress ? (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {content}
      </Animated.View>
    </Pressable>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.isAndroid ? 'transparent' : '#FFFFFF',
    ...theme.elevation.card,
  },
  white: { backgroundColor: '#FFFFFF' },
  ambient: { backgroundColor: theme.colors.surfaceVariant },
  tonal: { backgroundColor: theme.colors.secondaryContainer },
  hero: { backgroundColor: theme.colors.primaryContainer },
  chip: { backgroundColor: '#FFFFFF' },
  lg: { borderRadius: theme.isAndroid ? 24 : 20 },
  xl: { borderRadius: theme.isAndroid ? 28 : 24 },
  '2xl': { borderRadius: theme.shapes.card },
  '3xl': { borderRadius: theme.shapes.cardLarge },
  sm: { padding: 12 },
  md: { padding: 16 },
  largePadding: { padding: 22 },
  none: { padding: 0 },
  androidPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  iosPressed: {
    opacity: 0.88,
  },
});
