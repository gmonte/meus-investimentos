/* eslint-disable @typescript-eslint/no-var-requires */
import type { Config } from 'tailwindcss'
import pluginRadix from 'tailwindcss-radix'
import theme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        ...theme.fontFamily,
        sans: ['Inter', ...theme.fontFamily.sans],
        mono: ['Fira Code', ...theme.fontFamily.mono]
      },
      boxShadow: { slider: '0 0 0 5px rgba(0, 0, 0, 0.3)' },
      keyframes: {
        // Toast
        'toast-hide': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'toast-slide-in-right': {
          '0%': { transform: 'translateX(calc(100% + 1rem))' },
          '100%': { transform: 'translateX(0)' }
        },
        'toast-slide-in-bottom': {
          '0%': { transform: 'translateY(calc(100% + 1rem))' },
          '100%': { transform: 'translateY(0)' }
        },
        'toast-swipe-out': {
          '0%': { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          '100%': { transform: 'translateX(calc(100% + 1rem))' }
        }
      },
      animation: {
        // Toast
        'toast-hide': 'toast-hide 100ms ease-in forwards',
        'toast-slide-in-right':
          'toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-slide-in-bottom':
          'toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-swipe-out': 'toast-swipe-out 100ms ease-out forwards'
      }
    }
  },
  plugins: [pluginRadix]
}

export default config
