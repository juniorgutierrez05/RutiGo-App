import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

/**
 * Sistema de diseño adaptable:
 * En Android: Aplica los principios de Material 3 Expressive (formas de píldora,
 * elevaciones tonales, contrastes marcados y curvaturas orgánicas).
 * En iOS: Mantiene la paleta limpia y estética clásica de RutiGo (HIG de Apple).
 */
export const theme = {
  isAndroid,
  isIOS: Platform.OS === 'ios',

  colors: {
    // Colores principales
    primary: '#FF7A59',
    onPrimary: '#FFFFFF',
    primaryContainer: isAndroid ? '#FFDBD2' : '#FFEBE3',
    onPrimaryContainer: isAndroid ? '#3B0901' : '#1E1927',

    secondary: '#00AEB7',
    onSecondary: '#FFFFFF',
    secondaryContainer: isAndroid ? '#D2F7F9' : '#E5FAF8',
    onSecondaryContainer: isAndroid ? '#00363D' : '#006E73',

    // Superficies y fondos
    background: '#FFFCF8',
    surface: '#FFFFFF',
    surfaceVariant: isAndroid ? '#F7EEE9' : '#FFF9F5',
    onSurface: '#1E1927',
    onSurfaceVariant: '#806F69',

    // Bordes
    outline: isAndroid ? '#EADBD3' : '#F0E4DC',
    outlineVariant: '#F7ECE6',
  },

  shapes: {
    // En Android M3 Expressive las esquinas son más pronunciadas y orgánicas
    card: isAndroid ? 30 : 22,
    cardLarge: isAndroid ? 36 : 28,
    button: isAndroid ? 28 : 24, // Forma píldora
    chip: isAndroid ? 24 : 20,
    modal: isAndroid ? 36 : 26,
  },

  typography: {
    display: {
      fontSize: isAndroid ? 34 : 30,
      fontWeight: '900' as const,
      letterSpacing: isAndroid ? -0.8 : -0.2,
    },
    titleLarge: {
      fontSize: 22,
      fontWeight: '900' as const,
      letterSpacing: isAndroid ? -0.3 : 0,
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '800' as const,
    },
    bodyLarge: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    labelLarge: {
      fontSize: 14,
      fontWeight: '800' as const,
      letterSpacing: isAndroid ? 0.3 : 0,
    },
  },

  elevation: {
    card: isAndroid
      ? {
          elevation: 4,
          shadowColor: '#2B1712',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
        }
      : {
          elevation: 2,
          shadowColor: '#8B716B',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
    floating: isAndroid
      ? {
          elevation: 8,
          shadowColor: '#2B1712',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.16,
          shadowRadius: 18,
        }
      : {
          elevation: 6,
          shadowColor: '#1E1927',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
  },
};
