import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    fileParallelism: false,
    poolOptions: {
      threads: { singleThread: true },
    },
  },
});
