import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      components: `${path.resolve(__dirname, "./src/components/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages"),
      types: `${path.resolve(__dirname, "./src/@types")}`,
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      // your existing /api proxy
      "/api": {
        target: "https://dash.predictif.ai",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      // ← catch “/alpha/*” and forward it to alphavantage.co
      "/alpha": {
        target: "https://www.alphavantage.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/alpha/, ""),
      },
    },
  },
})
