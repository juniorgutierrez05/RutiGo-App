/**
 * RutiGo Design Tokens - Color Palette
 * Extraído del prototipo de Google Stitch y Guía de Estilo Caribe Atlántico
 */

export const colors = {
  // Brand gradients & accents
  coral: {
    primary: '#FF7A59',
    light: '#FFB199',
    dark: '#B83414',
    gradient: 'linear-gradient(135deg, #FFB199 0%, #FF7A59 100%)',
    pill: 'linear-gradient(135deg, #FF957D 0%, #FF7A59 100%)',
  },
  turquesa: {
    primary: '#00C2CB',
    light: '#7FF0E0',
    dark: '#006E73',
    gradient: 'linear-gradient(135deg, #7FF0E0 0%, #00C2CB 100%)',
    pill: 'linear-gradient(135deg, #00D5DF 0%, #009DA6 100%)',
  },
  amarillo: {
    primary: '#FFC93C',
    light: '#FFE49C',
    dark: '#CA9A00',
    gradient: 'linear-gradient(135deg, #FFE180 0%, #FFC93C 100%)',
  },
  violeta: {
    primary: '#7B61FF',
    light: '#C9B8FF',
    dark: '#583BD9',
    gradient: 'linear-gradient(135deg, #A895FF 0%, #7B61FF 100%)',
  },
  verde: {
    primary: '#2ECC71',
    light: '#B9F6CA',
    dark: '#18B85C',
    gradient: 'linear-gradient(135deg, #7BE9A8 0%, #2ECC71 100%)',
  },
  // Surfaces and background
  background: '#FFFCF8',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF7F2',
  surfaceContainerLow: '#F9F1FF',
  surfaceContainerHigh: '#EEE4F9',
  surfaceDim: '#E0D6EB',
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
      color: '#7B61FF',
      light: '#F3EFFF',
      badge: 'linear-gradient(135deg, #9681FF 0%, #7B61FF 100%)',
      label: 'Cultura & Tradición',
      icon: 'palette',
    },
    gastronomia: {
      color: '#FF7A59',
      light: '#FFF0EB',
      badge: 'linear-gradient(135deg, #FFB199 0%, #FF7A59 100%)',
      label: 'Gastronomía Caribeña',
      icon: 'restaurant',
    },
    naturaleza: {
      color: '#2ECC71',
      light: '#E8F9EE',
      badge: 'linear-gradient(135deg, #7BE9A8 0%, #2ECC71 100%)',
      label: 'Naturaleza & Playas',
      icon: 'forest',
    },
    historia: {
      color: '#CA9A00',
      light: '#FFF8E7',
      badge: 'linear-gradient(135deg, #FFE180 0%, #FFC93C 100%)',
      label: 'Historia & Patrimonio',
      icon: 'castle',
    },
  },
};
