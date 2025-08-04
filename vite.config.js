import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true
  },
  server: {
    force: true
  },
   base: 'Planejamento-Semanal',
   build: {
    chunkSizeWarningLimit: 1000 // Aumenta o limite para 1MB (padrão é 500kB)
  }
}) 