import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';
import { Button } from '../components/Button.native';

const steps = [
  {
    title: 'Explora los tesoros del\n',
    highlight: 'Atlántico Mágico',
    description: 'Descubre rutas artesanales en Usiacurí, atardeceres coloniales en Salgar y sabores autóctonos en Baranoa.',
    image: IMAGES.mascot.iguanaSuitcase,
    badge: '◈ Cultura & Artesanías',
  },
  {
    title: 'Geolocalización & Rutas\n',
    highlight: 'a tu propio ritmo',
    description: 'Mapas interactivos con puntos GPS precisos, distancias exactas y tiempos estimados a pie o en auto.',
    image: IMAGES.mascot.iguanaMapIsland,
    badge: '⌖ GPS en Tiempo Real',
  },
  {
    title: 'Comunidad de Viajeros &\n',
    highlight: 'Reseñas Reales',
    description: 'Guarda tus rutas favoritas, califica experiencias auténticas y apoya a las familias artesanas del Caribe.',
    image: IMAGES.mascot.iguanaSmiling,
    badge: '★ 5 Estrellas Caribeñas',
  },
];

export function OnboardingScreen() {
  const { navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);

  const artSize = Math.min(width * 0.68, height * 0.32, 280);
  const imageSize = artSize * 0.88;

  const step = steps[currentStep];
  const next = () => (currentStep < steps.length - 1 ? setCurrentStep(currentStep + 1) : navigateTo('login'));

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
        },
      ]}
    >
      <View style={styles.top}>
        <View style={styles.topPill}>
          <Text style={styles.topPillText}>Atlántico Mágico</Text>
        </View>
        <Pressable onPress={() => navigateTo('login')} hitSlop={8}>
          <Text style={styles.skip}>Saltar</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={[styles.art, { width: artSize, height: artSize }]}>
          <Image
            source={step.image}
            style={{ width: imageSize, height: imageSize, borderRadius: 18 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <Text style={styles.badge}>{step.badge}</Text>
        </View>
        <Text style={styles.title}>
          {step.title}
          <Text style={styles.highlight}>{step.highlight}</Text>
        </Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {steps.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => setCurrentStep(index)}
              style={[styles.dot, index === currentStep && styles.activeDot]}
            />
          ))}
        </View>
        <Button
          fullWidth
          size="lg"
          icon={currentStep === steps.length - 1 ? '➜' : '→'}
          iconPosition="right"
          onPress={next}
        >
          {currentStep === steps.length - 1 ? '¡Empezar Aventura!' : 'Siguiente'}
        </Button>
        {currentStep === steps.length - 1 && (
          <Text style={styles.loginHint}>
            ¿Ya tienes cuenta?{' '}
            <Text onPress={() => navigateTo('login')} style={styles.loginLink}>
              Inicia sesión
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFCF8',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topPill: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topPillText: {
    color: '#FF7A59',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  skip: {
    color: '#806F69',
    fontSize: 14,
    fontWeight: '700',
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#F0E4DC',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#FFF0EB',
    color: '#006E73',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    fontWeight: '800',
    fontSize: 11,
    borderWidth: 1,
    borderColor: '#F0E4DC',
  },
  title: {
    color: '#1E1927',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 31,
  },
  highlight: {
    color: '#FF7A59',
  },
  description: {
    color: '#806F69',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
  },
  footer: {
    paddingBottom: 4,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0D5CF',
  },
  activeDot: {
    width: 26,
    backgroundColor: '#FF7A59',
  },
  loginHint: {
    color: '#806F69',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 12,
  },
  loginLink: {
    color: '#FF7A59',
    fontWeight: '800',
  },
});
