/**
 * Testes de Tema - Playwright
 * Testa troca de tema e consistência visual
 */

import { test, expect } from "@playwright/test";

test.describe("Testes de Tema", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Troca de Tema", () => {
    test("Deve alternar entre light e dark theme", async ({ page }) => {
      // Verifica tema inicial (light por padrão)
      const htmlClass = await page.locator("html").getAttribute("class");
      const isInitiallyDark = htmlClass?.includes("dark");

      // Clica no toggle de tema
      const themeToggle = page.getByRole("button", { name: /tema|theme/i });
      await themeToggle.click();

      // Aguarda transição
      await page.waitForTimeout(300);

      // Verifica se mudou
      const newHtmlClass = await page.locator("html").getAttribute("class");
      const isNowDark = newHtmlClass?.includes("dark");

      expect(isNowDark).toBe(!isInitiallyDark);

      // Screenshot do novo tema
      await page.screenshot({
        path: `screenshots/theme-${isNowDark ? "dark" : "light"}.png`,
        fullPage: true,
      });
    });

    test("Deve persistir tema no localStorage", async ({ page }) => {
      // Alterna para dark theme
      const themeToggle = page.getByRole("button", { name: /tema|theme/i });
      await themeToggle.click();
      await page.waitForTimeout(300);

      // Verifica localStorage
      const savedTheme = await page.evaluate(() =>
        localStorage.getItem("theme")
      );
      expect(savedTheme).toBe("dark");

      // Recarrega página
      await page.reload();

      // Verifica se tema foi mantido
      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).toContain("dark");
    });

    test("Deve respeitar preferência do sistema", async ({ page, context }) => {
      // Remove localStorage para testar preferência do sistema
      await page.evaluate(() => localStorage.removeItem("theme"));

      // Simula preferência dark do sistema
      await context.emulateMedia({ colorScheme: "dark" });
      await page.reload();

      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).toContain("dark");
    });
  });

  test.describe("Componentes em Dark Theme", () => {
    test.beforeEach(async ({ page }) => {
      // Força dark theme
      await page.addInitScript(() => {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      });
    });

    test("Botões devem ter cores corretas", async ({ page }) => {
      await page.goto("/");

      const primaryButton = page
        .getByRole("button", { name: /começar/i })
        .first();
      const bgColor = await primaryButton.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );

      // Verifica se não é branco puro (que seria errado no dark)
      expect(bgColor).not.toBe("rgb(255, 255, 255)");

      await page.screenshot({
        path: "screenshots/dark-buttons.png",
      });
    });

    test("Cards devem ter background escuro", async ({ page }) => {
      await page.goto("/games");

      const gameCard = page.locator('[data-testid="game-card"]').first();
      await gameCard.waitFor({ state: "visible" });

      const bgColor = await gameCard.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );

      // Extrai RGB e verifica se é escuro (valores baixos)
      const rgb = bgColor.match(/\d+/g)?.map(Number);
      if (rgb) {
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        expect(brightness).toBeLessThan(128); // Deve ser escuro
      }
    });

    test("Texto deve ter contraste adequado", async ({ page }) => {
      await page.goto("/feed");

      // Verifica cor do texto principal
      const mainText = page.getByRole("heading").first();
      const color = await mainText.evaluate(
        (el) => window.getComputedStyle(el).color
      );

      // Texto deve ser claro (valores altos de RGB)
      const rgb = color.match(/\d+/g)?.map(Number);
      if (rgb) {
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        expect(brightness).toBeGreaterThan(128); // Deve ser claro
      }
    });

    test("EmptyState deve ser visível no dark theme", async ({ page }) => {
      await page.goto("/teams");

      // Se houver empty state
      const emptyState = page.locator('[role="status"]').first();
      if (await emptyState.isVisible()) {
        const bgColor = await emptyState.evaluate(
          (el) => window.getComputedStyle(el).backgroundColor
        );

        // Deve ter background (não transparente)
        expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");

        await page.screenshot({
          path: "screenshots/dark-empty-state.png",
        });
      }
    });
  });

  test.describe("Componentes em Light Theme", () => {
    test.beforeEach(async ({ page }) => {
      // Força light theme
      await page.addInitScript(() => {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      });
    });

    test("Cards devem ter background claro", async ({ page }) => {
      await page.goto("/games");

      const gameCard = page.locator('[data-testid="game-card"]').first();
      await gameCard.waitFor({ state: "visible" });

      const bgColor = await gameCard.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );

      // Extrai RGB e verifica se é claro (valores altos)
      const rgb = bgColor.match(/\d+/g)?.map(Number);
      if (rgb) {
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        expect(brightness).toBeGreaterThan(200); // Deve ser claro
      }
    });

    test("Texto deve ter contraste adequado", async ({ page }) => {
      await page.goto("/feed");

      const mainText = page.getByRole("heading").first();
      const color = await mainText.evaluate(
        (el) => window.getComputedStyle(el).color
      );

      // Texto deve ser escuro (valores baixos de RGB)
      const rgb = color.match(/\d+/g)?.map(Number);
      if (rgb) {
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        expect(brightness).toBeLessThan(100); // Deve ser escuro
      }
    });
  });

  test.describe("Contraste de Cores (WCAG AA)", () => {
    test("Texto normal deve ter contraste 4.5:1", async ({ page }) => {
      await page.goto("/");

      // Função para calcular contraste
      const calculateContrast = await page.evaluate(() => {
        function getLuminance(rgb) {
          const [r, g, b] = rgb.map((val) => {
            val /= 255;
            return val <= 0.03928
              ? val / 12.92
              : Math.pow((val + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        function getContrastRatio(color1, color2) {
          const lum1 = getLuminance(color1);
          const lum2 = getLuminance(color2);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }

        const paragraph = document.querySelector("p");
        if (!paragraph) return null;

        const textColor = window.getComputedStyle(paragraph).color;
        const bgColor = window.getComputedStyle(paragraph).backgroundColor;

        const textRgb = textColor.match(/\d+/g).map(Number);
        const bgRgb = bgColor.match(/\d+/g).map(Number);

        return getContrastRatio(textRgb, bgRgb);
      });

      if (calculateContrast) {
        expect(calculateContrast).toBeGreaterThanOrEqual(4.5);
      }
    });

    test("Texto grande deve ter contraste 3:1", async ({ page }) => {
      await page.goto("/");

      const heading = page.getByRole("heading", { level: 1 }).first();

      const contrast = await heading.evaluate((el) => {
        function getLuminance(rgb) {
          const [r, g, b] = rgb.map((val) => {
            val /= 255;
            return val <= 0.03928
              ? val / 12.92
              : Math.pow((val + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        function getContrastRatio(color1, color2) {
          const lum1 = getLuminance(color1);
          const lum2 = getLuminance(color2);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }

        const textColor = window.getComputedStyle(el).color;
        const bgColor = window.getComputedStyle(el).backgroundColor;

        const textRgb = textColor.match(/\d+/g).map(Number);
        const bgRgb = bgColor.match(/\d+/g).map(Number);

        return getContrastRatio(textRgb, bgRgb);
      });

      expect(contrast).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe("Comparação Visual Entre Temas", () => {
    test("Deve capturar screenshots de ambos os temas", async ({ page }) => {
      const pages = ["/", "/feed", "/games", "/teams", "/chat"];

      for (const url of pages) {
        await page.goto(url);

        // Light theme
        await page.evaluate(() => {
          localStorage.setItem("theme", "light");
          document.documentElement.classList.remove("dark");
        });
        await page.waitForTimeout(300);
        await page.screenshot({
          path: `screenshots/light-${url.replace("/", "home")}.png`,
          fullPage: true,
        });

        // Dark theme
        await page.evaluate(() => {
          localStorage.setItem("theme", "dark");
          document.documentElement.classList.add("dark");
        });
        await page.waitForTimeout(300);
        await page.screenshot({
          path: `screenshots/dark-${url.replace("/", "home")}.png`,
          fullPage: true,
        });
      }
    });
  });
});
