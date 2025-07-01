import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Factor Eco brand colors
        'sky-blue': '#7DD3FC', // Primary: buttons, links, headers
        'peach-light': '#FFD6A5', // Secondary: hover states, highlights
        'mint-green': '#B8E0D2', // Accent: labels, icons, call-to-action
      },
    },
  },
  plugins: [animate],
} satisfies Config

export default config
