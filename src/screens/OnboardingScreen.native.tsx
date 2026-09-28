import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';
import { Button } from '../components/Button.native';
const steps = [{ title: 'Explora los tesoros del', highlight: 'Atlántico Mágico', description: 'Descubre rutas artesanales en Usiacurí, atardeceres coloniales en Salgar y sabores autóctonos en Baranoa.', image: IMAGES.mascot.iguanaSuitcase, badge: '◈ Cultura & Artesanías' }, { title: 'Geolocalización & Rutas', highlight: 'a tu propio ritmo', description: 'Mapas interactivos con puntos GPS precisos, distancias exactas y tiempos estimados a pie o en auto.', image: IMAGES.mascot.iguanaMapIsland, badge: '⌖ GPS en Tiempo Real' }, { title: 'Comunidad de Viajeros &', highlight: 'Reseñas Reales', description: 'Guarda tus rutas favoritas, califica experiencias auténticas y apoya a las familias artesanas del Caribe.', image: IMAGES.mascot.iguanaSmiling, badge: '★ 5 Estrellas Caribeñas' }];
export function OnboardingScreen() { 
    const { navigateTo } = useApp(); 
    const [currentStep, setCurrentStep] = useState(0); 
    const step = steps[currentStep]; 
    const next = () => currentStep < steps.length - 1 ? setCurrentStep(currentStep + 1) : navigateTo('login'); 
    return <View style={styles.root}>
        <View style={styles.top}>
            
            <Pressable onPress={() => navigateTo('login')}>
                <Text style={styles.skip}>Saltar</Text>
                </Pressable>
                </View>
                <View style={styles.main}>
                    <View style={styles.art}>
                        <Image source={{ uri: step.image }} style={styles.image} />
                        <Text style={styles.badge}>{step.badge}</Text>
                        </View>
                        <Text style={styles.title}>
                            {step.title} 
                            <Text style={styles.highlight}>{step.highlight}</Text>
                        </Text>
                        <Text style={styles.description}>
                            {step.description}</Text>
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.dots}>
                                    {steps.map((_, index) => 
                                    <Pressable key={index} onPress={() => setCurrentStep(index)} style={[styles.dot, index === currentStep && styles.activeDot]} />
                                )}
                                </View>
                                <Button fullWidth size="lg" icon={currentStep === steps.length - 1 ? '➜' : '→'} iconPosition="right" onPress={next}>{currentStep === steps.length - 1 ? '¡Empezar Aventura!' : 'Siguiente'}</Button>
                                {currentStep === steps.length - 1 && 
                                <Text style={styles.loginHint}>
                                    ¿Ya tienes cuenta? 
                                    <Text onPress={() => navigateTo('login')} style={styles.highlight}>
                                        Inicia sesión</Text>
                                        </Text>
                                        }
                                        </View>
                                        </View>; 
                                        }
const styles = StyleSheet.create({ 
    root: { flex: 1, backgroundColor: '#fff', padding: 20 }, 
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }, 
    skip: { color: '#806F69', fontSize: 13, fontWeight: '700' }, 
    main: { flex: 1, alignItems: 'center', justifyContent: 'center' }, 
    art: { width: 300, height: 300, borderRadius: 30, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 30, borderWidth: 2, borderColor: '#F0E4DC' }, 
    image: { width: 265, height: 265, borderRadius: 15}, 
    badge: { position: 'absolute', bottom: -12, backgroundColor: '#FFF0EB', color: '#5db872', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, fontWeight: '800' }, 
    title: { color: '#1E1927', fontSize: 25, fontWeight: '900', textAlign: 'center', lineHeight: 32 }, 
    highlight: { color: '#ffd200' }, 
    description: { color: '#858081', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 12 }, 
    footer: { paddingBottom: 8 }, 
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18 }, 
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0D5CF' }, 
    activeDot: { width: 30, backgroundColor: '#5db872' }, 
    loginHint: { color: '#806F69', textAlign: 'center', fontSize: 12, marginTop: 13 } });
