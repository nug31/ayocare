/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette inspired by turquoise pool with lemons
        'pool': {
          50: '#f0fdfa',   // Very light teal
          100: '#ccfbf1',  // Light teal
          200: '#99f6e4',  // Lighter teal
          300: '#5eead4',  // Light turquoise
          400: '#2dd4bf',  // Medium turquoise
          500: '#0E6973',  // Main dark teal from image
          600: '#0d7377',  // Darker teal
          700: '#0f5f63',  // Deep teal
          800: '#115e59',  // Very deep teal
          900: '#134e4a',  // Darkest teal
        },
        'turquoise': {
          50: '#f0fdfa',
          100: '#ccfbf1', 
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#118C8C',  // Medium turquoise from image
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'citrus': {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a', 
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F2BB16',  // Bright yellow from image
          600: '#d97706',
          700: '#BF820F', // Orange from image
          800: '#92400e',
          900: '#78350f',
        },
        'mint': {
          50: '#f7fefc',
          100: '#f0fdf9',
          200: '#ccfdf2',
          300: '#99fce4', 
          400: '#5dfbd3',
          500: '#BAD9CE',  // Light mint from image
          600: '#10d9b5',
          700: '#0bb394',
          800: '#059669',
          900: '#064e3b',
        }
      },
      backgroundImage: {
        'pool-gradient': 'linear-gradient(135deg, #118C8C 0%, #0E6973 100%)',
        'citrus-gradient': 'linear-gradient(135deg, #F2BB16 0%, #BF820F 100%)',
        'fresh-gradient': 'linear-gradient(135deg, #BAD9CE 0%, #118C8C 50%, #0E6973 100%)',
      }
    },
  },
  plugins: [],
};
