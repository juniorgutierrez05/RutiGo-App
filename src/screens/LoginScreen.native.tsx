import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { Card } from '../components/Card.native';
import { Input } from './nativeShared';

export function LoginScreen() {
  const { login, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      return Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña.');
    }
    try {
      setBusy(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('No se pudo iniciar sesión', error instanceof Error ? error.message : 'Revisa tus datos.');
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
        <Text style={styles.title}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>Guarda tus rutas y continúa explorando el Atlántico.</Text>
        
        <Card padding="lg" rounded="2xl">
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
            autoCapitalize="none"
          />
          <View style={styles.buttons}>
            <Button fullWidth size="lg" onPress={submit}>
              {busy ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
            <Button
              fullWidth
              variant="outline"
              onPress={() => Alert.alert('Google', 'Configura Google Auth nativo para activar este acceso.')}
            >
              Continuar con Google
            </Button>
          </View>
        </Card>

        <Pressable onPress={() => navigateTo('register')} hitSlop={6}>
          <Text style={styles.link}>Crear una cuenta</Text>
        </Pressable>
        <Pressable onPress={() => navigateTo('home')} hitSlop={6}>
          <Text style={styles.guest}>Explorar sin registrarme</Text>
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
  buttons: { gap: 12, marginTop: 6 },
  link: { color: '#FF7A59', fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 14 },
  guest: { color: '#806F69', fontSize: 13, textAlign: 'center', marginTop: 6 },
});
