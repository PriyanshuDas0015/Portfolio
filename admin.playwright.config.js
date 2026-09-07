const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './admin/tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5174', headless: true, viewport: { width: 1280, height: 900 } },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command:
      'node node_modules/vite/bin/vite.js admin --config admin/vite.config.js --host 127.0.0.1',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
