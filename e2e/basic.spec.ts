import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/HR Operations Platform/)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('should have navigation to login', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.getByRole('link', { name: /sign in|login/i })
    await expect(loginLink).toBeVisible()
  })

  test('should have navigation to register', async ({ page }) => {
    await page.goto('/')
    const registerLink = page.getByRole('link', { name: /get started|sign up|register/i })
    await expect(registerLink).toBeVisible()
  })
})

test.describe('Health Check', () => {
  test('should return healthy status', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('services')
  })
})

test.describe('CSRF Token', () => {
  test('should generate CSRF token', async ({ request }) => {
    const response = await request.get('/api/csrf')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data).toHaveProperty('token')
    expect(data.token).toBeTruthy()
  })
})
