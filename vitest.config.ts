import { defineConfig } from 'vitest/config';
import { join } from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./test/setup.ts'],
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
            '@/core': join(__dirname, 'src/core'),
            '@/features': join(__dirname, 'src/features'),
            '@/pages': join(__dirname, 'src/pages'),
        },
    },
});
