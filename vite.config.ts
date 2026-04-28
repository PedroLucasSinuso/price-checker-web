import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    https: {
      key: fs.readFileSync('192.168.0.110+2-key.pem'),
      cert: fs.readFileSync('192.168.0.110+2.pem'),
    },
  },
})