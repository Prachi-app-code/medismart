import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5600,
    cors: {
      origin: 'https://semi-mature-olivia-bidirectional.ngrok-free.dev',
      credentials: true
    }
  }
})