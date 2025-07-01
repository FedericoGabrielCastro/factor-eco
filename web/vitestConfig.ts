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
      //TODO: Add more aliases here
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/api/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/context/**/*.{ts,tsx}',
        'src/pages/**/*.{ts,tsx}',
        'src/routes/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}'
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test/**/*'
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
