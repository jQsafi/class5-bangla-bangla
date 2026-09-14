/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,json}",
  ],
  safelist: [
    {
      pattern: /(from|to|via|bg)-(indigo|violet|purple|blue|sky|teal|emerald|green|rose|pink|red|orange|cyan|slate)-(400|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Bengali"', '"Hind Siliguri"', '"Kalpurush"', 'system-ui', 'sans-serif'],
        bangla: ['"Noto Sans Bengali"', '"Hind Siliguri"', '"Kalpurush"', 'system-ui', 'sans-serif'],
        mono: ['"Noto Sans Bengali"', '"Hind Siliguri"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
