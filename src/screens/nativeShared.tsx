import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
export function Input({ label, ...props }: { label: string } & TextInputProps) { return <View style={styles.group}><Text style={styles.label}>{label}</Text><TextInput {...props} style={[styles.input, props.multiline && styles.multiline]} placeholderTextColor="#806F69" /></View>; }
const styles = StyleSheet.create({ group: { marginBottom: 14 }, label: { color: '#1E1927', fontSize: 13, fontWeight: '800', marginBottom: 7 }, input: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: '#F0E4DC', backgroundColor: '#FFFFFF', paddingHorizontal: 14, color: '#1E1927', fontSize: 15 }, multiline: { minHeight: 100, textAlignVertical: 'top', paddingTop: 12 } });
