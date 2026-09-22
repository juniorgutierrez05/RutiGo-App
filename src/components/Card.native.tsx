import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type CardProps = { children: React.ReactNode; variant?: 'white' | 'ambient' | 'hero' | 'chip'; rounded?: 'lg' | 'xl' | '2xl' | '3xl'; padding?: 'sm' | 'md' | 'lg' | 'none'; interactive?: boolean; onPress?: () => void };

export function Card({ children, variant = 'white', rounded = '2xl', padding = 'md', interactive, onPress }: CardProps) { const content = <View style={[styles.base, styles[variant], styles[rounded], styles[padding === 'lg' ? 'largePadding' : padding]]}>{children}</View>; return interactive || onPress ? <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable> : content; }
const styles = StyleSheet.create({ base: { overflow: 'hidden', borderWidth: 1, borderColor: '#FFFFFF', shadowColor: '#8B716B', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 }, white: { backgroundColor: '#FFFFFF' }, ambient: { backgroundColor: '#FFF9F5' }, hero: { backgroundColor: '#FFEBE3' }, chip: { backgroundColor: '#FFFFFF' }, lg: { borderRadius: 20 }, xl: { borderRadius: 24 }, '2xl': { borderRadius: 28 }, '3xl': { borderRadius: 32 }, sm: { padding: 12 }, md: { padding: 16 }, largePadding: { padding: 20 }, none: { padding: 0 }, pressed: { opacity: 0.88 } });
