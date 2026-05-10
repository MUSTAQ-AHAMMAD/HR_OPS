#!/usr/bin/env node
/**
 * Screenshot Capture Script (Optional)
 *
 * This script uses Playwright to automatically capture screenshots of the application.
 *
 * SETUP:
 * 1. Install Playwright: npm install -D playwright
 * 2. Make sure the app is running: npm run dev (in another terminal)
 * 3. Make sure database is seeded: npm run db:seed
 * 4. Run this script: node screenshots/capture-screenshots.js
 *
 * Or capture manually using browser tools (recommended for first-time users)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = __dirname;

// Demo credentials
const DEMO_EMAIL = 'admin@hrops.com';
const DEMO_PASSWORD = 'Admin@123';

const screenshots = [
  {
    name: '01-landing-page.png',
    url: '/',
    description: 'Landing page',
    waitFor: 'h1',
  },
  {
    name: '02-register-page.png',
    url: '/register',
    description: 'Registration page',
    waitFor: 'input[name="name"]',
  },
  {
    name: '03-login-page.png',
    url: '/login',
    description: 'Login page',
    waitFor: 'input[name="email"]',
  },
  {
    name: '04-dashboard-page.png',
    url: '/dashboard',
    description: 'Dashboard page',
    requiresAuth: true,
    waitFor: 'h1',
  },
];

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...\n');

  // Check if Playwright is installed
  try {
    require.resolve('playwright');
  } catch (error) {
    console.error('❌ Playwright is not installed.');
    console.log('\n📦 Install it with: npm install -D playwright');
    console.log('📦 Or capture screenshots manually (see screenshots/README.md)\n');
    process.exit(1);
  }

  let browser;
  let context;
  let page;

  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    page = await context.newPage();

    // Check if app is running
    console.log(`🔍 Checking if app is running at ${APP_URL}...`);
    try {
      await page.goto(APP_URL, { timeout: 5000, waitUntil: 'domcontentloaded' });
      console.log('✅ App is running\n');
    } catch (error) {
      console.error(`❌ Cannot connect to ${APP_URL}`);
      console.log('\n💡 Make sure the app is running:');
      console.log('   npm run dev\n');
      process.exit(1);
    }

    let isAuthenticated = false;

    // Capture each screenshot
    for (const screenshot of screenshots) {
      console.log(`📸 Capturing: ${screenshot.description}...`);

      // Login if required and not already authenticated
      if (screenshot.requiresAuth && !isAuthenticated) {
        console.log('   🔐 Logging in...');
        await page.goto(`${APP_URL}/login`);
        await page.waitForSelector('input[name="email"]', { timeout: 5000 });
        await page.fill('input[name="email"]', DEMO_EMAIL);
        await page.fill('input[name="password"]', DEMO_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL(`${APP_URL}/dashboard`, { timeout: 10000 });
        isAuthenticated = true;
        console.log('   ✅ Logged in');
      }

      // Navigate to the page
      await page.goto(`${APP_URL}${screenshot.url}`, {
        waitUntil: 'networkidle',
        timeout: 10000,
      });

      // Wait for key element
      if (screenshot.waitFor) {
        await page.waitForSelector(screenshot.waitFor, { timeout: 5000 });
      }

      // Wait a bit for animations
      await page.waitForTimeout(1000);

      // Take screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshot.name);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
      });

      console.log(`   ✅ Saved: ${screenshot.name}\n`);
    }

    console.log('✨ All screenshots captured successfully!');
    console.log(`📁 Location: ${SCREENSHOTS_DIR}\n`);

  } catch (error) {
    console.error('\n❌ Error capturing screenshots:');
    console.error(error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure the app is running: npm run dev');
    console.log('   2. Make sure database is seeded: npm run db:seed');
    console.log('   3. Check that demo credentials work in browser');
    console.log('   4. Or capture screenshots manually (see screenshots/README.md)\n');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
captureScreenshots().catch(console.error);
