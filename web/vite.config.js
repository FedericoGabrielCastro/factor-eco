var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { vitestConfig } from './vitestConfig';
export default defineConfig(function (_a) {
    return __assign(__assign({}, vitestConfig), { plugins: [react(), tailwindcss()], server: {
            host: '0.0.0.0',
            port: 3000,
        }, test: {
            environment: 'jsdom',
            setupFiles: ['./src/test/setup.ts'],
            globals: true,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html'],
                include: ['src/**/*.{ts,tsx}'],
                exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts', 'src/test/**/*'],
            },
        }, resolve: {
            alias: {
                '@/api': path.resolve(__dirname, 'src/api'),
                '@/hooks': path.resolve(__dirname, 'src/hooks'),
                '@/context': path.resolve(__dirname, 'src/context'),
                '@/pages': path.resolve(__dirname, 'src/pages'),
                '@/routes': path.resolve(__dirname, 'src/routes'),
                '@/components': path.resolve(__dirname, 'src/components'),
                '@/utils': path.resolve(__dirname, 'src/utils'),
            },
        }, optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom'],
        }, build: {
            outDir: 'dist',
            sourcemap: true,
            chunkSizeWarningLimit: 500,
            manifest: true, // Generates manifest.json for asset tracking/cleanup
        } });
});
