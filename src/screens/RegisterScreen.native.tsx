import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { Card } from '../components/Card.native';
import { Input } from './nativeShared';

export function RegisterScreen() {
  const { register, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState('Barranquilla');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCity = city.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return Alert.alert('Campos incompletos', 'Completa todos los campos obligatorios.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
    }
    if (password.length < 8) {
      return Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 8 caracteres.');
    }
    try {
      setBusy(true);
      await register(trimmedName, trimmedEmail, password, trimmedCity || 'Barranquilla');
    } catch (error) {
      Alert.alert('No se pudo crear la cuenta', error instanceof Error ? error.message : 'Intenta nuevamente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 20,
            paddingBottom: Math.max(insets.bottom, 16) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>RUTIGO</Text>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Únete a la comunidad viajera del Atlántico.</Text>
        
        <Card padding="lg" rounded="2xl">
          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
          />
          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            rightElement={
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#806F69"
                />
              </Pressable>
            }
          />
          <Input
            label="Municipio base"
            value={city}
            onChangeText={setCity}
            placeholder="Barranquilla"
          />
          <Button fullWidth size="lg" onPress={submit} disabled={busy}>
            {busy ? 'Creando...' : 'Registrarme'}
          </Button>
        </Card>

        <Pressable onPress={() => navigateTo('login')} hitSlop={6}>
          <Text style={styles.link}>Ya tengo una cuenta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  eyebrow: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: '#1E1927', fontSize: 28, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginBottom: 8 },
  link: { color: '#FF7A59', fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 14 },
});
