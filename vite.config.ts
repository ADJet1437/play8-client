import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // Use absolute paths for production
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure proper asset handling
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming
        manualChunks: undefined,
      },
    },
  },
})