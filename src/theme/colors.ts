/**
 * RutiGo Design Tokens - Official Brand Palette
 * Paleta Oficial: Rojo (#E60124), Amarillo (#FFD200), Verde (#5DB872), Fondo Blanco (#FFFFFF)
 */

export const colors = {
  // Brand official colors
  brandRed: {
    primary: '#E60124',
    light: '#FF6B81',
    dark: '#B8001D',
    container: '#FDE8EA',
  },
  brandYellow: {
    primary: '#FFD200',
    light: '#FFE466',
    dark: '#CCA800',
    container: '#FFFBE6',
  },
  brandGreen: {
    primary: '#5DB872',
    light: '#8ED29E',
    dark: '#3D9452',
    container: '#EEF8F1',
  },
  // Legacy aliases mapped to official brand
  coral: {
    primary: '#E60124',
    light: '#FF6B81',
    dark: '#B8001D',
    gradient: 'linear-gradient(135deg, #FF6B81 0%, #E60124 100%)',
    pill: 'linear-gradient(135deg, #FF455F 0%, #E60124 100%)',
  },
  turquesa: {
    primary: '#5DB872',
    light: '#8ED29E',
    dark: '#3D9452',
    gradient: 'linear-gradient(135deg, #8ED29E 0%, #5DB872 100%)',
    pill: 'linear-gradient(135deg, #72C786 0%, #4EA362 100%)',
  },
  amarillo: {
    primary: '#FFD200',
    light: '#FFE466',
    dark: '#CCA800',
    gradient: 'linear-gradient(135deg, #FFE466 0%, #FFD200 100%)',
  },
  violeta: {
    primary: '#E60124',
    light: '#FF8596',
    dark: '#B8001D',
    gradient: 'linear-gradient(135deg, #FF6B81 0%, #E60124 100%)',
  },
  verde: {
    primary: '#5DB872',
    light: '#8ED29E',
    dark: '#3D9452',
    gradient: 'linear-gradient(135deg, #8ED29E 0%, #5DB872 100%)',
  },
  // Surfaces and background: 100% fondo blanco oficial en todas las vistas
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSoft: '#FFFFFF',
  surfaceContainerLow: '#FFFFFF',
  surfaceContainerHigh: '#F8F9FA',
  surfaceDim: '#EDEDED',
  // Typography neutrals
  text: {
    primary: '#1E1927',
    secondary: '#58423C',
    tertiary: '#8B716B',
    inverse: '#FEF7FF',
    onCoral: '#FFFFFF',
    onTurquesa: '#FFFFFF',
  },
  // Categories mapping
  categories: {
    cultura: {
      color: '#E60124',
      light: '#FDE8EA',
      badge: 'linear-gradient(135deg, #FF6B81 0%, #E60124 100%)',
      label: 'Cultura & Tradición',
      icon: 'palette',
    },
    gastronomia: {
      color: '#E60124',
      light: '#FDE8EA',
      badge: 'linear-gradient(135deg, #FF6B81 0%, #E60124 100%)',
      label: 'Gastronomía Caribeña',
      icon: 'restaurant',
    },
    naturaleza: {
      color: '#5DB872',
      light: '#EEF8F1',
      badge: 'linear-gradient(135deg, #8ED29E 0%, #5DB872 100%)',
      label: 'Naturaleza & Playas',
      icon: 'forest',
    },
    historia: {
      color: '#FFD200',
      light: '#FFFBE6',
      badge: 'linear-gradient(135deg, #FFE466 0%, #FFD200 100%)',
      label: 'Historia & Patrimonio',
      icon: 'castle',
    },
  },
};
