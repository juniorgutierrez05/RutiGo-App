import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'circle'; size?: 'sm' | 'md' | 'lg'; icon?: string; iconPosition?: 'left' | 'right'; fullWidth?: boolean; disabled?: boolean; onPress?: () => void };

export function Button({ children, variant = 'primary', size = 'md', icon, iconPosition = 'left', fullWidth, disabled, onPress }: ButtonProps) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.base, styles[variant], styles[size], fullWidth && styles.fullWidth, disabled && styles.disabled]}>{icon && iconPosition === 'left' && <Text style={styles.icon}>{icon}</Text>}<Text style={[styles.label, variant === 'outline' || variant === 'ghost' ? styles.darkLabel : styles.lightLabel]}>{children}</Text>{icon && iconPosition === 'right' && <Text style={styles.icon}>{icon}</Text>}</Pressable>;
}

const styles = StyleSheet.create({ base: { minHeight: 48, borderRadius: 26, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#FFFFFF' }, primary: { backgroundColor: '#FF7A59', shadowColor: '#B83414', shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 }, secondary: { backgroundColor: '#00C2CB' }, outline: { backgroundColor: '#FFFFFF', borderColor: '#FF7A59' }, ghost: { backgroundColor: 'transparent', borderColor: 'transparent' }, circle: { width: 46, height: 46, minHeight: 46, paddingHorizontal: 0, borderRadius: 23, backgroundColor: '#FFFFFF' }, sm: { minHeight: 38, paddingHorizontal: 16 }, md: {}, lg: { minHeight: 54, paddingHorizontal: 24 }, fullWidth: { width: '100%' }, disabled: { opacity: 0.5 }, icon: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' }, label: { fontSize: 14, fontWeight: '800' }, lightLabel: { color: '#FFFFFF' }, darkLabel: { color: '#1E1927' } });
