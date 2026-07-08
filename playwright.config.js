// @ts-check
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
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
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 35000,
  expect: {
    timeout: 5000, //for assertions
    
  },
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', // on
    screenshot: 'off',
    ignoreHTTPSErrors: true,
    viewport: null,              // disables default 1280x720 viewport
    launchOptions: {
      args: ['--start-maximized']
    },


  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome (system)',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',   // tells Playwright to use the Chrome you already use for browsing
        headless: false,     // optional, set true if you want headless
      },
    },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     headless: false,     // optional, set true if you want headless
    //   },
    // },
    // {
    //   name: 'Microsoft Edge (system)',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',   // uses your installed Edge
    //     headless: false,     // optional, set true if you want headless
    //   },
    // },
    // {
    //   name: 'Firefox (system)',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     channel: 'firefox',  // uses your installed Firefox
    //   },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

