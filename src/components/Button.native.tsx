import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/expressiveTheme';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'circle' | 'tonal';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth,
  disabled,
  onPress,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Física de resortes de M3 Expressive con rebote (overshoot) orgánico
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: theme.isAndroid ? 0.93 : 0.96,
      useNativeDriver: true,
      speed: 22,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 15,
      bounciness: theme.isAndroid ? 12 : 6, // Rebote elástico característico de M3 Expressive
    }).start();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={fullWidth ? styles.fullWidth : undefined}
    >
      <Animated.View
        style={[
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {icon && iconPosition === 'left' && <Text style={styles.icon}>{icon}</Text>}
        <Text
          style={[
            styles.label,
            variant === 'outline' || variant === 'ghost'
              ? styles.darkLabel
              : variant === 'tonal'
              ? styles.tonalLabel
              : styles.lightLabel,
          ]}
        >
          {children}
        </Text>
        {icon && iconPosition === 'right' && <Text style={styles.icon}>{icon}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: theme.shapes.button,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    ...theme.elevation.card,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    ...theme.elevation.card,
  },
  tonal: {
    backgroundColor: theme.colors.primaryContainer,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderColor: theme.colors.outline,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  circle: {
    width: 48,
    height: 48,
    minHeight: 48,
    paddingHorizontal: 0,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderColor: theme.colors.outline,
    ...theme.elevation.card,
  },
  sm: { minHeight: 38, paddingHorizontal: 16 },
  md: {},
  lg: { minHeight: 56, paddingHorizontal: 26 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  androidPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  iosPressed: {
    opacity: 0.75,
  },
  icon: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  label: { ...theme.typography.labelLarge },
  lightLabel: { color: '#FFFFFF' },
  darkLabel: { color: theme.colors.onSurface },
  tonalLabel: { color: theme.colors.onPrimaryContainer },
});
