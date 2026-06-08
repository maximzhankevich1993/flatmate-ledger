/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0A0A0E',        // Ультра-темный графит (обсидиан)
          card: '#111116',      // Глубокий угольный для основы карточек
          orange: '#EA580C',    // Главный огненный неон для акцентов
          amber: '#F59E0B',     // Теплый янтарный для градиентов и статусов
          green: '#00FF87',     // Кислотно-зеленый для успешного выполнения задач
          red: '#FF0055',       // Рубиновый для просроченных дедлайнов
        }
      },
      boxShadow: {
        // Фирменное объемное свечение "Liquid Glass"
        'neon-orange': '0 0 25px rgba(234, 88, 12, 0.25)',
        'neon-amber': '0 0 25px rgba(245, 158, 11, 0.2)',
        'neon-green': '0 0 30px rgba(0, 255, 135, 0.35)',
      },
      backdropBlur: {
        'xl': '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}
