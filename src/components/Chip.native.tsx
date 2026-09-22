import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { CategoryType } from '../types';

type ChipProps = { label: string; icon?: string; category?: CategoryType; selected?: boolean; onClick?: () => void; onClear?: () => void; count?: number; size?: 'sm' | 'md' };
const categoryColors: Record<CategoryType, string> = { gastronomia: '#FF7A59', naturaleza: '#2ECC71', cultura: '#7B61FF', historia: '#CA9A00' };
export function Chip({ label, icon, category, selected, onClick, onClear, count, size = 'md' }: ChipProps) { const color = category ? categoryColors[category] : '#FF7A59'; return <Pressable onPress={onClick} style={[styles.base, size === 'sm' ? styles.small : styles.medium, selected ? { backgroundColor: color, borderColor: color } : styles.unselected]}><Text style={[styles.text, selected && styles.selectedText]}>{icon ? `${icon} ` : ''}{label}{count !== undefined ? ` (${count})` : ''}</Text>{onClear && <Text onPress={onClear} style={styles.close}>×</Text>}</Pressable>; }
const styles = StyleSheet.create({ base: { borderRadius: 22, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }, small: { minHeight: 32, paddingHorizontal: 12 }, medium: { minHeight: 42, paddingHorizontal: 16 }, unselected: { backgroundColor: '#FFFFFF', borderColor: '#F0E4DC' }, text: { color: '#1E1927', fontSize: 13, fontWeight: '700' }, selectedText: { color: '#FFFFFF' }, close: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' } });
