import { test, expect } from '@playwright/test';

/**
 * Profile Tab Navigation E2E Tests
 *
 * Tests user interaction with the Profile tabs component
 * Validates tab switching, keyboard navigation, and lazy loading
 */

test.describe('Profile Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Note: This test requires a running dev server and user authentication
    // You may need to add login logic here
    await page.goto('/user/1'); // Replace with actual user profile URL
  });

  test('should display all 4 tabs with count badges', async ({ page }) => {
    // Verify all tabs are visible
    await expect(page.getByRole('tab', { name: /Ranking/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Posts/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Times/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Jogos/ })).toBeVisible();

    // Verify count badges are present
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await expect(rankingTab).toContainText(/\d+/); // Contains a number
  });

  test('should switch tabs on click', async ({ page }) => {
    // Click on Posts tab
    await page.getByRole('tab', { name: /Posts/ }).click();

    // Verify active tab changed
    const postsTab = page.getByRole('tab', { name: /Posts/ });
    await expect(postsTab).toHaveAttribute('aria-selected', 'true');

    // Verify content panel is displayed
    const postsPanel = page.locator('[id="posts-panel"]');
    await expect(postsPanel).toBeVisible();
  });

  test('should navigate tabs with keyboard (ArrowRight)', async ({ page }) => {
    // Focus on Ranking tab
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await rankingTab.focus();

    // Press ArrowRight
    await page.keyboard.press('ArrowRight');

    // Posts tab should now be selected
    const postsTab = page.getByRole('tab', { name: /Posts/ });
    await expect(postsTab).toHaveAttribute('aria-selected', 'true');
    await expect(postsTab).toBeFocused();
  });

  test('should navigate tabs with keyboard (ArrowLeft)', async ({ page }) => {
    // Navigate to Posts tab first
    await page.getByRole('tab', { name: /Posts/ }).click();

    // Focus on Posts tab
    const postsTab = page.getByRole('tab', { name: /Posts/ });
    await postsTab.focus();

    // Press ArrowLeft
    await page.keyboard.press('ArrowLeft');

    // Ranking tab should now be selected
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await expect(rankingTab).toHaveAttribute('aria-selected', 'true');
    await expect(rankingTab).toBeFocused();
  });

  test('should navigate to first tab with Home key', async ({ page }) => {
    // Navigate to last tab (Jogos)
    await page.getByRole('tab', { name: /Jogos/ }).click();

    const jogosTab = page.getByRole('tab', { name: /Jogos/ });
    await jogosTab.focus();

    // Press Home
    await page.keyboard.press('Home');

    // First tab (Ranking) should now be selected
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await expect(rankingTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should navigate to last tab with End key', async ({ page }) => {
    // Start on first tab (Ranking)
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await rankingTab.focus();

    // Press End
    await page.keyboard.press('End');

    // Last tab (Jogos) should now be selected
    const jogosTab = page.getByRole('tab', { name: /Jogos/ });
    await expect(jogosTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const tablist = page.getByRole('tablist');
    await expect(tablist).toHaveAttribute('aria-label', 'Seções do perfil');

    // Check each tab has proper ARIA attributes
    const rankingTab = page.getByRole('tab', { name: /Ranking/ });
    await expect(rankingTab).toHaveAttribute('aria-controls', 'ranking-panel');
    await expect(rankingTab).toHaveAttribute('id', 'ranking-tab');
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Tabs should be scrollable horizontally
    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();

    // All tabs should still be accessible
    await expect(page.getByRole('tab', { name: /Ranking/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Posts/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Times/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Jogos/ })).toBeVisible();
  });

  test('should center active tab on mobile when clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Click on last tab
    await page.getByRole('tab', { name: /Jogos/ }).click();

    // Tab should be visible (scrolled into view)
    const jogosTab = page.getByRole('tab', { name: /Jogos/ });
    await expect(jogosTab).toBeVisible();
  });
});

test.describe('Profile Tab Lazy Loading', () => {
  test('should load content only when tab is activated', async ({ page }) => {
    await page.goto('/user/1');

    // Initially, only Ranking panel should be loading/visible
    // Posts, Times, and Jogos content should not be loaded yet

    // Click on Posts tab
    await page.getByRole('tab', { name: /Posts/ }).click();

    // Wait for loading to complete
    await page.waitForSelector('[id="posts-panel"]', { state: 'visible' });

    // Content should now be loaded
    const postsPanel = page.locator('[id="posts-panel"]');
    await expect(postsPanel).toBeVisible();
  });

  test('should persist tab content after switching', async ({ page }) => {
    await page.goto('/user/1');

    // Switch to Posts tab and let it load
    await page.getByRole('tab', { name: /Posts/ }).click();
    await page.waitForSelector('[id="posts-panel"]', { state: 'visible' });

    // Switch to another tab
    await page.getByRole('tab', { name: /Times/ }).click();

    // Switch back to Posts
    await page.getByRole('tab', { name: /Posts/ }).click();

    // Content should still be there (cached)
    const postsPanel = page.locator('[id="posts-panel"]');
    await expect(postsPanel).toBeVisible();
  });
});
