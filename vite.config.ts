import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// F10.9: vite-ssg prerender shu yerga ulanadi
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
