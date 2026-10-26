import { defineConfig } from 'vitest/config';
export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'jsdom',
    include: ['frontend/tests/**/*.test.{js,jsx}'],
    setupFiles: ['frontend/tests/setup.js'],
    restoreMocks: true,
  },
});
