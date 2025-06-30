import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export const vitestConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 8,
        minThreads: 4,
      },
    },
    // Test execution settings
    testTimeout: 10000,
    hookTimeout: 10000,
    alias: {
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/router': path.resolve(__dirname, 'src/router'),
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['json', 'text', 'clover'],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/config/*.{ts,tsx}',
        'src/forms/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/icons/**/*.{ts,tsx}',
        'src/layout/**/*.{ts,tsx}',
        'src/models/**/*.{ts,tsx}',
        'src/pages/*.{ts,tsx}',
        'src/router/**/*.{ts,tsx}',
        'src/services/**/*.{ts,tsx}',
        'src/store/**/*.{ts,tsx}',
        'src/ToastProvider.tsx',
        'src/utils/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'vite-env.d.ts',
        'src/router/RouterProvider.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
