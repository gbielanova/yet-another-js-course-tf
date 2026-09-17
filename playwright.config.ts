import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { BASE_URL } from './config/baseConfig';

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    testIdAttribute: 'data-test',
  },

  /* Configure projects for major browsers */
  projects: [
    {name: 'perform-login', testMatch: /auth\.login\.spec\.ts/ },

    /* No storageState in these projects on purpose: tests are anonymous unless
       they ask for the loggedInApp fixture, which loads the saved session itself.
       Every test carries exactly one of @smoke / @regression, so the two
       projects together run the whole suite once. */
    {
      name: 'smoke',
      grep: /@smoke/,
      testIgnore: /auth\.login\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['perform-login'],
    },

    {
      name: 'regression',
      grep: /@regression/,
      testIgnore: /auth\.login\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['perform-login'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ]
});
