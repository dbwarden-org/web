import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'lightningcss',
  },
  build: {
    cssMinify: 'lightningcss',
    // oxc (Rust) is the most aggressive JS minifier available here:
    // benchmarked against terser with passes:5 + toplevel + full compress
    // on this bundle, oxc wins: 518.48 kB / 157.71 gzip vs 518.94 / 158.69,
    // and builds ~30x faster (117ms vs 3.7s).
    minify: 'oxc',
  },
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})
