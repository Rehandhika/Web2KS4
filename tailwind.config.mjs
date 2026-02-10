/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0A0B10', // Deep Navy
          800: '#161821', // Slate Grey Surface
        },
        azure: {
          DEFAULT: '#00D1FF', // Electric Azure
          light: '#70EFFF',
          dark: '#0085A3',
        },
        ocean: {
          900: '#0A192F', // Deep Oceanic Blue for Slide 2
        },
        mist: '#E2E8F0', // Silver Mist Body
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'unmask': 'unmask 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'subtle-float': 'subtleFloat 10s ease-in-out infinite',
      },
      keyframes: {
        unmask: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(10px, -15px)' }
        }
      }
    }
  },
  plugins: []
};