import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  use: {
    headless: true,
    baseURL: 'https://muoamzih.manus.space',
  },
});


