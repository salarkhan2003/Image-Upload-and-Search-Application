// Professional Theme Configuration
export const theme = {
  // Primary Colors
  colors: {
    primary: {
      deepBlue: '#0F2137',
      charcoalBlack: '#121212',
      metallicSilver: '#C0C0C0',
    },
    accent: {
      brightCyan: '#00F0FF',
      electricBlue: '#1E90FF',
      pureWhite: '#FFFFFF',
    },
    background: {
      primary: '#121212',
      secondary: '#0F2137',
      card: 'rgba(15, 33, 55, 0.8)',
      cardHover: 'rgba(15, 33, 55, 0.95)',
      overlay: 'rgba(18, 18, 18, 0.9)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#C0C0C0',
      muted: 'rgba(192, 192, 192, 0.7)',
    },
    border: 'rgba(192, 192, 192, 0.2)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Inter', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },
  
  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(0, 240, 255, 0.3)',
    glowBlue: '0 0 20px rgba(30, 144, 255, 0.4)',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    dark: 'linear-gradient(135deg, #121212 0%, #0F2137 100%)',
    subtle: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(30, 144, 255, 0.1) 100%)',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme;