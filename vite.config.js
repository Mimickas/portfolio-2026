import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permet l'accès depuis toutes les IP
    port: 5173, // ton port actuel
    allowedHosts: ['sententious-uncrushable-billye.ngrok-free.dev'], // ajoute ton host ngrok
  },
})