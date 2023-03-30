import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginFonts } from 'vite-plugin-fonts'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    },
  },
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: [
          {
            name: 'Inter',
            styles: 'wght@400;600;700'
          },
          {
            name: 'Fira Code',
            styles: 'wght@400;600;700'
          }
        ],
      },
    }),
  ]
})
