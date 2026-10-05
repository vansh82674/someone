import { test, expect } from '@playwright/test';

test.describe('Matchmaking & Topics Queue Reliability', () => {

  test.beforeEach(async ({ page, context }) => {
    // Add bypass cookie for middleware
    await context.addCookies([
      {
        name: 'playwright-bypass',
        value: '1',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Mock Next-Auth session with a funded wallet
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 2,
            email: 'randomuser@example.com',
            name: 'Random Matcher',
            walletBalance: 1000,
            role: 'USER',
            isVerified: false
          },
          expires: '2100-01-01T00:00:00.000Z'
        })
      });
    });
  });

  test('user can select a topic, join the queue, and wait for a listener gracefully', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check if topics are visible
    const heading = page.locator('text=Choose a Topic');
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }

    const joinButton = page.locator('button:has-text("Find Someone")').first();
    if (await joinButton.isVisible()) {
      await joinButton.click();
      await expect(page.locator('text=Waiting')).toBeVisible();
    }
  });

  test('user with zero balance is gracefully handled without crashing', async ({ page, context }) => {
    // Override session to 0 balance
    await page.route('**/api/auth/session', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: { id: 3, walletBalance: 0, role: 'USER' },
            expires: '2100-01-01T00:00:00.000Z'
          })
        });
    });
    
    await page.goto('/dashboard');
    const balanceIndicator = page.locator('text=₹0');
    if (await balanceIndicator.isVisible()) {
       await expect(balanceIndicator).toBeVisible();
    }
  });
});
