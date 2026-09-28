import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { Card } from '../components/Card.native';
import { Input } from './nativeShared';
export function LoginScreen() { 
    const { login, navigateTo } = useApp(); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [busy, setBusy] = useState(false); 
    const submit = async () => { 
        if (!email || !password) 
            return Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña.'); 
        try { setBusy(true); 
            await login(email, password); 
        } 
        catch (error) { Alert.alert('No se pudo iniciar sesión', error instanceof Error ? error.message : 'Revisa tus datos.'); 

        } 
        finally { setBusy(false); } }; 
        return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content}>
              
                <Text style={styles.title}>Bienvenido de vuelta</Text>
                <Text style={styles.subtitle}>Guarda tus rutas y continúa explorando el Atlántico.</Text>
                <Card padding="lg" rounded="2xl" >
                    <Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
                    <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
                    <View style={styles.buttons}>
                        <Button fullWidth size="lg" onPress={submit}>{busy ? 'Cargando...' : 'Iniciar sesión'}</Button>
                    <Button fullWidth variant="outline" onPress={() => Alert.alert('Google', 'Configura Google Auth nativo para activar este acceso.')}>Continuar con Google</Button>
                    </View>
                    
                </Card>
                <Pressable onPress={() => navigateTo('register')}>
                    <Text style={styles.link}>Crear una cuenta</Text>
                </Pressable>
                <Pressable onPress={() => navigateTo('home')}>
                    <Text style={styles.guest}>Explorar sin registrarme</Text>
                </Pressable>
                </ScrollView>
                </KeyboardAvoidingView>; 
                }
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#fff' }, 
    content: { flexGrow: 1, justifyContent: 'center', padding: 22, gap: 14 }, 
    title: { color: '#1E1927', fontSize: 30, fontWeight: '900' }, 
    subtitle: { color: '#806F69', fontSize: 15, lineHeight: 22, marginBottom: 10 }, 
    link: { color: '#FF7A59', fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 16 }, 
    guest: { color: '#806F69', fontSize: 13, textAlign: 'center', marginTop: 8 },
    buttons: {gap: 15} });
