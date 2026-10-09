import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const [city, setCity] = useState('Barranquilla');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Campos incompletos', 'Completa todos los campos.');
    }
    try {
      setBusy(true);
      await register(name, email, password, city);
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
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <Input
            label="Municipio base"
            value={city}
            onChangeText={setCity}
            placeholder="Barranquilla"
          />
          <Button fullWidth size="lg" onPress={submit}>
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
