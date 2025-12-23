/**
 * E2E Tests for Authentication Flows
 * Generated based on browser observation of Pagine Azzurre
 */
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display header with navigation', async ({ page }) => {
    await page.goto('/');

    // Header elements - use specific selectors
    await expect(page.getByRole('link', { name: 'Pagine Azzurre' })).toBeVisible();
    await expect(page.getByPlaceholder('Cerca prodotti...')).toBeVisible();
    await expect(page.getByText('Tutti Noi')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Registrati' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Accedi' })).toBeVisible();
  });

  test('should display activity tabs', async ({ page }) => {
    await page.goto('/');

    // Category tabs - use text matching
    await expect(page.getByText('Offerte', { exact: true })).toBeVisible();
    await expect(page.getByText('Richieste', { exact: true })).toBeVisible();
    await expect(page.getByText('Proposte', { exact: true })).toBeVisible();
    await expect(page.getByText('Avvisi', { exact: true })).toBeVisible();
    await expect(page.getByText('Dono/Tempo', { exact: true })).toBeVisible();
  });

  test('should display footer with team info', async ({ page }) => {
    await page.goto('/');

    // Footer - use role contentinfo
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'VALAZCO' })).toBeVisible();
    await expect(page.getByText('© 2025 Pagine Azzurre')).toBeVisible();
  });

  test('should show cookie consent banner', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies();
    await page.goto('/');

    // Cookie banner should be visible
    await expect(page.getByText('I cookie ci aiutano')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rifiuto' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accetto' })).toBeVisible();
  });

  test('should hide cookie banner after accepting', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');

    await page.getByRole('button', { name: 'Accetto' }).click();

    await expect(page.getByText('I cookie ci aiutano')).not.toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Accedi').click();

    await expect(page).toHaveURL('/signin');
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/signin');

    // Title and subtitle
    await expect(page.getByRole('heading', { name: 'Accedi' })).toBeVisible();
    await expect(page.getByText('Benvenuto su Pagine Azzurre')).toBeVisible();

    // Form fields
    await expect(page.getByPlaceholder('Inserisci la tua email')).toBeVisible();
    await expect(page.getByPlaceholder('Inserisci la tua password')).toBeVisible();

    // Submit button
    await expect(page.getByRole('button', { name: 'Accedi' })).toBeVisible();

    // Links
    await expect(page.getByText('Registrati')).toBeVisible();
    await expect(page.getByText('Recupera password')).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.goto('/signin');

    // Click submit without filling fields
    await page.getByRole('button', { name: 'Accedi' }).click();

    // Form should show validation (HTML5 required)
    const emailInput = page.getByPlaceholder('Inserisci la tua email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should navigate to register from login', async ({ page }) => {
    await page.goto('/signin');

    await page.getByRole('link', { name: 'Registrati' }).click();

    await expect(page).toHaveURL('/register');
  });
});

test.describe('Register Page', () => {
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Registrati').first().click();

    await expect(page).toHaveURL('/register');
  });

  test('should display register form elements', async ({ page }) => {
    await page.goto('/register');

    // Title and subtitle
    await expect(page.getByRole('heading', { name: 'Crea il tuo Account' })).toBeVisible();
    await expect(page.getByText('Unisciti alla comunità di Pagine Azzurre')).toBeVisible();

    // Form fields
    await expect(page.getByPlaceholder('Inserisci il tuo username')).toBeVisible();
    await expect(page.getByPlaceholder('Inserisci la tua email')).toBeVisible();
    await expect(page.getByPlaceholder('Conferma la tua email')).toBeVisible();
    await expect(page.getByPlaceholder(/password.*6 caratteri/i)).toBeVisible();
    await expect(page.getByPlaceholder('Conferma la password')).toBeVisible();
  });

  test('should display radio options', async ({ page }) => {
    await page.goto('/register');

    // Radio for groups/associations
    await expect(page.getByText('Partecipi a gruppi, movimenti')).toBeVisible();

    // Radio for newsletter
    await expect(page.getByText('Vuoi iscriverti alla nostra newsletter?')).toBeVisible();
  });

  test('should display submit button and login link', async ({ page }) => {
    await page.goto('/register');

    // Submit button
    await expect(page.getByRole('button', { name: 'Registrati' })).toBeVisible();

    // Login link
    await expect(page.getByText('Hai già un account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Accedi' })).toBeVisible();
  });

  test('should navigate to login from register', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('link', { name: 'Accedi' }).click();

    await expect(page).toHaveURL('/signin');
  });

  test('should show required field indicators', async ({ page }) => {
    await page.goto('/register');

    // Check for asterisks indicating required fields
    await expect(page.getByText('Username *')).toBeVisible();
    await expect(page.getByText('Indirizzo Email *')).toBeVisible();
    await expect(page.getByText('Password *')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/');

    // Click on different tabs
    await page.getByRole('button', { name: 'Richieste' }).click();
    await expect(page.getByRole('button', { name: 'Richieste' })).toHaveClass(/active|selected/i);

    await page.getByRole('button', { name: 'Proposte' }).click();
    await expect(page.getByRole('button', { name: 'Proposte' })).toHaveClass(/active|selected/i);
  });

  test('should navigate to home by clicking logo', async ({ page }) => {
    await page.goto('/signin');

    await page.getByText('Pagine Azzurre').first().click();

    await expect(page).toHaveURL('/');
  });
});
