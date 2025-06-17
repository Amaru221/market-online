import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:8000',
        changeOrigin: true,     // Cambia el origen a localhost:8000
        secure: true,          // Si usas HTTPS con certificado autofirmado
        // Agrega esto para evitar problemas con websockets o HTTP2 (si aplica)
        ws: false,
      },
    },
  },
});