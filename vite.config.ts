import { defineConfig } from 'vite-plus'

export default defineConfig({
  base: '/egro/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  staged: {
    '*': 'vp check --fix',
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  fmt: {
    semi: false,
    singleQuote: true,
  },
})
