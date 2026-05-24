import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config: registers React and Tailwind as plugins
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // processes Tailwind utility classes automatically
  ],
})
