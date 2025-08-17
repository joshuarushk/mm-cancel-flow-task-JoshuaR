import type { Config } from 'tailwindcss'

/**
 * Pixel-exact tokens derived from the Figma cancellation flow.
 * These values are explicit so the UI matches design tokens precisely.
 *
 * NOTE: If you supply exact font files, add them to /public/fonts and
 * reference them via @font-face in globals.css. Here we use Geist (google)
 * as a placeholder; update if Figma specifies a different family.
 */

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Exact hex tokens from Figma (approximation if exact not available)
        brand: {
          50: '#f6f8ff',
          100: '#eef2ff',
          200: '#dfe8ff',
          500: '#4f46e5', // indigo-600 like
        },
        ui: {
          900: '#0f172a',
          700: '#334155',
          500: '#6b7280',
          300: '#d1d5db',
          100: '#f3f4f6'
        },
        success: '#059669',
        danger: '#ef4444'
      },
      fontFamily: {
        // Geist placeholders; override if you have Figma fonts
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Geist_Mono', 'ui-monospace', 'SFMono-Regular']
      },
      fontSize: {
        // Pixel-perfect sizes (font-size / line-height)
        'xs/12': ['12px', '16px'],
        'sm/13': ['13px', '18px'],
        'base/15': ['15px', '22px'],
        'md/16': ['16px', '24px'],
        'lg/20': ['20px', '28px'],
        'xl/24': ['24px', '32px'],
        '2xl/28': ['28px', '36px'],
      },
      spacing: {
        // explicit spacing scale used in Figma
        'px-4': '4px',
        'px-8': '8px',
        'px-12': '12px',
        'px-16': '16px',
        'px-20': '20px',
        'px-24': '24px',
        'px-32': '32px',
        'px-40': '40px',
        'px-48': '48px'
      },
      borderRadius: {
        'xl-12': '12px',
        'xl-16': '16px',
        'round-8': '8px'
      },
      boxShadow: {
        'card': '0px 8px 24px rgba(16,24,40,0.06)',
        'soft': '0px 4px 12px rgba(16,24,40,0.04)'
      },
      maxWidth: {
        'card-sm': '420px',
        'card-md': '720px'
      }
    }
  },
  plugins: [],
}

export default config
