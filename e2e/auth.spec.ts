import { test, expect } from '@playwright/test'

test.describe('User Login Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check for email field
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toBeVisible()

    // Check for password field
    const passwordInput = page.getByLabel(/password/i)
    await expect(passwordInput).toBeVisible()

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /sign in|login/i })
    await expect(submitButton).toBeVisible()
  })

  test('should show demo credentials', async ({ page }) => {
    await page.goto('/login')

    // Check for demo credentials display
    const demoSection = page.getByText(/demo credentials/i)
    await expect(demoSection).toBeVisible()
  })

  test('should have link to register', async ({ page }) => {
    await page.goto('/login')

    const registerLink = page.getByRole('link', { name: /create|sign up/i })
    await expect(registerLink).toBeVisible()
  })

  test('should show validation error for empty fields', async ({ page }) => {
    await page.goto('/login')

    // Click submit without filling fields
    const submitButton = page.getByRole('button', { name: /sign in|login/i })
    await submitButton.click()

    // HTML5 validation should prevent submission
    const emailInput = page.getByLabel(/email/i)
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBe(false)
  })
})

test.describe('User Registration Flow', () => {
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL(/.*register/)
  })

  test('should display registration form', async ({ page }) => {
    await page.goto('/register')

    // Check for name field
    const nameInput = page.getByLabel(/name/i)
    await expect(nameInput).toBeVisible()

    // Check for email field
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toBeVisible()

    // Check for password field
    const passwordInput = page.getByLabel(/^password$/i)
    await expect(passwordInput).toBeVisible()

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /create|sign up|register/i })
    await expect(submitButton).toBeVisible()
  })

  test('should have link to login', async ({ page }) => {
    await page.goto('/register')

    const loginLink = page.getByRole('link', { name: /sign in|login/i })
    await expect(loginLink).toBeVisible()
  })

  test('should show password requirements', async ({ page }) => {
    await page.goto('/register')

    const requirements = page.getByText(/8 characters|uppercase|lowercase|number|special/i)
    await expect(requirements.first()).toBeVisible()
  })
})
