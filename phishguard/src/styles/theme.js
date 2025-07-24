const colors = {
  primary: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#1890FF',
    600: '#096DD9',
    700: '#0050B3',
    800: '#003A8C',
    900: '#002766',
  },
  secondary: {
    50: '#F0F5FF',
    100: '#D6E4FF',
    200: '#ADC6FF',
    300: '#85A5FF',
    400: '#597EF7',
    500: '#2F54EB',
    600: '#1D39C4',
    700: '#10239E',
    800: '#061178',
    900: '#030852',
  },
  success: {
    50: '#F6FFED',
    100: '#D9F7BE',
    200: '#B7EB8F',
    300: '#95DE64',
    400: '#73D13D',
    500: '#52C41A',
    600: '#389E0D',
    700: '#237804',
    800: '#135200',
    900: '#092B00',
  },
  warning: {
    50: '#FFF7E6',
    100: '#FFE7BA',
    200: '#FFD591',
    300: '#FFC069',
    400: '#FFA940',
    500: '#FA8C16',
    600: '#D46B08',
    700: '#AD4E00',
    800: '#873800',
    900: '#612500',
  },
  danger: {
    50: '#FFF1F0',
    100: '#FFCCC7',
    200: '#FFA39E',
    300: '#FF7875',
    400: '#FF4D4F',
    500: '#F5222D',
    600: '#CF1322',
    700: '#A8071A',
    800: '#820014',
    900: '#5C0011',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D9D9D9',
    400: '#BFBFBF',
    500: '#8C8C8C',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1F1F1F',
  },
  cyber: {
    neon: '#00FF9D',
    matrix: '#003B00',
    darkBlue: '#1A1B4B',
    lightBlue: '#4ED4FF',
    purple: '#6E1B9C',
    darkPurple: '#2D1B4B',
    background: '#0A0A0A',
  },
};

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  cyber: '0 0 10px rgba(0, 255, 65, 0.5)',
  glow: '0 0 20px rgba(78, 212, 255, 0.4)',
};

const gradients = {
  primary: 'linear-gradient(135deg, #1890FF 0%, #096DD9 100%)',
  secondary: 'linear-gradient(135deg, #2F54EB 0%, #1D39C4 100%)',
  success: 'linear-gradient(135deg, #52C41A 0%, #389E0D 100%)',
  warning: 'linear-gradient(135deg, #FA8C16 0%, #D46B08 100%)',
  danger: 'linear-gradient(135deg, #F5222D 0%, #CF1322 100%)',
  cyber: 'linear-gradient(135deg, #1A1B4B 0%, #2D1B4B 100%)',
  matrix: 'linear-gradient(135deg, #003B00 0%, #001F00 100%)',
  neon: 'linear-gradient(135deg, #00FF41 0%, #00B82D 100%)',
};

const animation = {
  fadeIn: 'fade-in 0.3s ease-in-out',
  slideUp: 'slide-up 0.4s ease-out',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  float: 'float 6s ease-in-out infinite',
  glow: 'glow 1.5s ease-in-out infinite alternate',
};

const keyframes = {
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'slide-up': {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '.5' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  },
  glow: {
    '0%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.2)' },
    '100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.6)' },
  },
};

const theme = {
  colors,
  shadows,
  gradients,
  animation,
  keyframes,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
};

export default theme; 