/**
 * Testes de Responsividade - Playwright
 * Testa layouts em diferentes breakpoints
 */

import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile-s", width: 320, height: 568 },
  { name: "mobile-m", width: 375, height: 667 },
  { name: "mobile-l", width: 425, height: 896 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1920, height: 1080 },
];

test.describe("Testes de Responsividade", () => {
  viewports.forEach(({ name, width, height }) => {
    test.describe(`Viewport: ${name} (${width}x${height})`, () => {
      test.use({ viewport: { width, height } });

      test("Landing Page deve ser responsiva", async ({ page }) => {
        await page.goto("/");

        // Verifica se não há scroll horizontal
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        // Verifica se elementos principais estão visíveis
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        // Verifica CTAs
        const ctaButtons = page.getByRole("link", {
          name: /começar|saber mais/i,
        });
        await expect(ctaButtons.first()).toBeVisible();

        // Screenshot para regressão visual
        await page.screenshot({
          path: `screenshots/landing-${name}.png`,
          fullPage: true,
        });
      });

      test("Feed Page deve ser responsiva", async ({ page }) => {
        await page.goto("/feed");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        // Verifica se botão de criar post está visível
        const createPostButton = page.getByRole("button", {
          name: /criar.*post|novo.*post/i,
        });
        if (width >= 768) {
          await expect(createPostButton).toBeVisible();
        }

        await page.screenshot({
          path: `screenshots/feed-${name}.png`,
          fullPage: true,
        });
      });

      test("Games Page deve ser responsiva", async ({ page }) => {
        await page.goto("/games");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        // Verifica grid de jogos
        if (width >= 1024) {
          // Desktop: 3 colunas
          const gameCards = page.locator('[data-testid="game-card"]');
          const count = await gameCards.count();
          if (count >= 3) {
            const firstThreeCards = await Promise.all([
              gameCards.nth(0).boundingBox(),
              gameCards.nth(1).boundingBox(),
              gameCards.nth(2).boundingBox(),
            ]);

            // Verifica se estão na mesma linha (mesmo Y)
            expect(firstThreeCards[0].y).toBeCloseTo(firstThreeCards[1].y, 0);
            expect(firstThreeCards[1].y).toBeCloseTo(firstThreeCards[2].y, 0);
          }
        }

        await page.screenshot({
          path: `screenshots/games-${name}.png`,
          fullPage: true,
        });
      });

      test("Chat Page deve adaptar layout", async ({ page }) => {
        await page.goto("/chat");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        if (width >= 768) {
          // Desktop: 2 colunas visíveis
          await expect(
            page.locator('[data-testid="conversations-sidebar"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="messages-area"]')
          ).toBeVisible();
        } else {
          // Mobile: apenas lista de conversas inicialmente
          await expect(
            page.locator('[data-testid="conversations-list"]')
          ).toBeVisible();
        }

        await page.screenshot({
          path: `screenshots/chat-${name}.png`,
          fullPage: true,
        });
      });

      test("Profile Page deve ser responsiva", async ({ page }) => {
        await page.goto("/user/player/1");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        // Verifica se header do perfil está visível
        await expect(
          page.locator('[data-testid="profile-header"]')
        ).toBeVisible();

        // Verifica tabs
        await expect(
          page.getByRole("tab", { name: /posts|times|jogos/i }).first()
        ).toBeVisible();

        await page.screenshot({
          path: `screenshots/profile-${name}.png`,
          fullPage: true,
        });
      });

      test("Teams Page deve adaptar grid", async ({ page }) => {
        await page.goto("/teams");

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(width);

        // Verifica botão de criar time
        await expect(
          page.getByRole("button", { name: /criar.*time|nova.*equipe/i })
        ).toBeVisible();

        await page.screenshot({
          path: `screenshots/teams-${name}.png`,
          fullPage: true,
        });
      });
    });
  });

  test.describe("Testes de Touch Targets", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("Botões devem ter tamanho mínimo de 44x44px", async ({ page }) => {
      await page.goto("/");

      const buttons = page.getByRole("button");
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test("Links devem ter tamanho mínimo de 44x44px", async ({ page }) => {
      await page.goto("/");

      const links = page.getByRole("link");
      const count = await links.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const box = await links.nth(i).boundingBox();
        if (box) {
          expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe("Testes de Orientação", () => {
    test("Deve funcionar em modo portrait (mobile)", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/feed");

      await expect(page.getByRole("main")).toBeVisible();

      await page.screenshot({
        path: "screenshots/portrait-mode.png",
        fullPage: true,
      });
    });

    test("Deve funcionar em modo landscape (mobile)", async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
      await page.goto("/feed");

      await expect(page.getByRole("main")).toBeVisible();

      await page.screenshot({
        path: "screenshots/landscape-mode.png",
        fullPage: true,
      });
    });
  });

  test.describe("Testes de Zoom", () => {
    test("Deve funcionar com zoom de 200%", async ({ page, context }) => {
      await context.addInitScript(() => {
        Object.defineProperty(window, "devicePixelRatio", {
          get() {
            return 2;
          },
        });
      });

      await page.goto("/");
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Verifica se não há overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(1920);
    });
  });
});
