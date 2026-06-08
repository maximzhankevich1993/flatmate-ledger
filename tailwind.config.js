/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Наша кастомная палитра для темного футуристичного интерфейса
        'cyber-orange': '#ff5e00',
        'cyber-amber': '#ffb700',
        'cyber-green': '#00ff66',
        'cyber-card': 'rgba(39, 39, 42, 0.4)', // Стеклянная подложка zinc-800 с прозрачностью
      },
      boxShadow: {
        // Свечения для кнопок и статус-дотсов
        'neon-orange': '0 0 20px rgba(255, 94, 0, 0.35)',
        'neon-green': '0 0 20px rgba(0, 255, 102, 0.5)',
      },
      fontFamily: {
        // Чистый современный гротеск в духе интерфейсов Notion и Canva
        sans: ['Inter', 'San Francisco', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}