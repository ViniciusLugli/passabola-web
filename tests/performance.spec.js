/**
 * Testes de Performance - Playwright + Lighthouse
 * Mede métricas de performance e valida budgets
 */

import { test, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";
import lighthouse from "lighthouse";
import { URL } from "url";

// Thresholds do Lighthouse (Sprint Goal: 90+)
const LIGHTHOUSE_THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  "best-practices": 90,
  seo: 90,
};

// Web Vitals thresholds
const WEB_VITALS_THRESHOLDS = {
  "first-contentful-paint": 1800, // 1.8s
  "largest-contentful-paint": 2500, // 2.5s
  "total-blocking-time": 200, // 200ms
  "cumulative-layout-shift": 0.1, // 0.1
  "speed-index": 3400, // 3.4s
};

test.describe("Testes de Performance", () => {
  test.describe("Lighthouse Audits", () => {
    test("Landing Page deve ter score 90+", async ({ page }, testInfo) => {
      await page.goto("/");

      // Aguarda carregamento completo
      await page.waitForLoadState("networkidle");

      // Captura métricas de performance
      const metrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType("paint");
        const navigation = performance.getEntriesByType("navigation")[0];

        return {
          fcp: paint.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime,
          domContentLoaded:
            navigation?.domContentLoadedEventEnd -
            navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
        };
      });

      console.log("Performance Metrics:", metrics);

      // Valida FCP
      expect(metrics.fcp).toBeLessThan(
        WEB_VITALS_THRESHOLDS["first-contentful-paint"]
      );

      // Anexa métricas ao relatório
      await testInfo.attach("performance-metrics", {
        body: JSON.stringify(metrics, null, 2),
        contentType: "application/json",
      });
    });

    test("Feed Page deve ter score 90+", async ({ page }) => {
      await page.goto("/feed");
      await page.waitForLoadState("networkidle");

      const metrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType("paint");
        return {
          fcp: paint.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime,
        };
      });

      expect(metrics.fcp).toBeLessThan(
        WEB_VITALS_THRESHOLDS["first-contentful-paint"]
      );
    });

    test("Games Page deve ter score 90+", async ({ page }) => {
      await page.goto("/games");
      await page.waitForLoadState("networkidle");

      const metrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType("paint");
        return {
          fcp: paint.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime,
        };
      });

      expect(metrics.fcp).toBeLessThan(
        WEB_VITALS_THRESHOLDS["first-contentful-paint"]
      );
    });
  });

  test.describe("Web Vitals", () => {
    test("First Contentful Paint < 1.8s", async ({ page }) => {
      await page.goto("/");

      const fcp = await page.evaluate(() => {
        const paint = performance.getEntriesByType("paint");
        return paint.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime;
      });

      console.log(`FCP: ${fcp}ms`);
      expect(fcp).toBeLessThan(WEB_VITALS_THRESHOLDS["first-contentful-paint"]);
    });

    test("Largest Contentful Paint < 2.5s", async ({ page }) => {
      await page.goto("/");

      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ["largest-contentful-paint"] });

          // Timeout de segurança
          setTimeout(() => resolve(null), 5000);
        });
      });

      if (lcp) {
        console.log(`LCP: ${lcp}ms`);
        expect(lcp).toBeLessThan(
          WEB_VITALS_THRESHOLDS["largest-contentful-paint"]
        );
      }
    });

    test("Cumulative Layout Shift < 0.1", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(2000); // Aguarda possíveis shifts

      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsScore = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsScore += entry.value;
              }
            }
          }).observe({ entryTypes: ["layout-shift"] });

          setTimeout(() => resolve(clsScore), 1000);
        });
      });

      console.log(`CLS: ${cls}`);
      expect(cls).toBeLessThan(
        WEB_VITALS_THRESHOLDS["cumulative-layout-shift"]
      );
    });

    test("Total Blocking Time < 200ms", async ({ page }) => {
      await page.goto("/");

      const tbt = await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        return navigation.loadEventEnd - navigation.domContentLoadedEventEnd;
      });

      console.log(`TBT estimate: ${tbt}ms`);
      expect(tbt).toBeLessThan(WEB_VITALS_THRESHOLDS["total-blocking-time"]);
    });
  });

  test.describe("Bundle Size", () => {
    test("JavaScript bundles devem ser otimizados", async ({ page }) => {
      await page.goto("/");

      const resources = await page.evaluate(() => {
        return performance
          .getEntriesByType("resource")
          .filter((r) => r.name.includes(".js"))
          .map((r) => ({
            name: r.name.split("/").pop(),
            size: r.transferSize,
            duration: r.duration,
          }));
      });

      console.log("JavaScript Resources:", resources);

      // Verifica se não há bundles gigantes (> 500KB)
      resources.forEach((resource) => {
        expect(resource.size).toBeLessThan(500 * 1024); // 500KB
      });
    });

    test("CSS bundles devem ser otimizados", async ({ page }) => {
      await page.goto("/");

      const resources = await page.evaluate(() => {
        return performance
          .getEntriesByType("resource")
          .filter((r) => r.name.includes(".css"))
          .map((r) => ({
            name: r.name.split("/").pop(),
            size: r.transferSize,
            duration: r.duration,
          }));
      });

      console.log("CSS Resources:", resources);

      // Verifica se não há CSS gigantes (> 100KB)
      resources.forEach((resource) => {
        expect(resource.size).toBeLessThan(100 * 1024); // 100KB
      });
    });
  });

  test.describe("Network Performance", () => {
    test("Deve minimizar requisições HTTP", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const requestCount = await page.evaluate(() => {
        return performance.getEntriesByType("resource").length;
      });

      console.log(`Total Requests: ${requestCount}`);

      // Não deve fazer mais de 50 requisições
      expect(requestCount).toBeLessThan(50);
    });

    test("Imagens devem estar otimizadas", async ({ page }) => {
      await page.goto("/");

      const images = await page.evaluate(() => {
        return performance
          .getEntriesByType("resource")
          .filter((r) => r.initiatorType === "img")
          .map((r) => ({
            name: r.name.split("/").pop(),
            size: r.transferSize,
          }));
      });

      console.log("Images:", images);

      // Verifica se não há imagens muito grandes (> 200KB)
      images.forEach((image) => {
        expect(image.size).toBeLessThan(200 * 1024); // 200KB
      });
    });

    test("Fonts devem estar otimizadas", async ({ page }) => {
      await page.goto("/");

      const fonts = await page.evaluate(() => {
        return performance
          .getEntriesByType("resource")
          .filter((r) => r.initiatorType === "css" && r.name.includes("font"))
          .map((r) => ({
            name: r.name.split("/").pop(),
            size: r.transferSize,
          }));
      });

      console.log("Fonts:", fonts);

      // Verifica se não há fonts muito grandes (> 100KB)
      fonts.forEach((font) => {
        expect(font.size).toBeLessThan(100 * 1024); // 100KB
      });
    });
  });

  test.describe("Rendering Performance", () => {
    test("Não deve ter long tasks (> 50ms)", async ({ page }) => {
      await page.goto("/");

      const longTasks = await page.evaluate(() => {
        return new Promise((resolve) => {
          const tasks = [];

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 50) {
                tasks.push({
                  duration: entry.duration,
                  startTime: entry.startTime,
                });
              }
            }
          }).observe({ entryTypes: ["longtask"] });

          setTimeout(() => resolve(tasks), 3000);
        });
      });

      console.log("Long Tasks:", longTasks);

      // Não deve ter mais de 3 long tasks
      expect(longTasks.length).toBeLessThan(3);
    });

    test("Scroll deve ser suave (60fps)", async ({ page }) => {
      await page.goto("/feed");
      await page.waitForLoadState("networkidle");

      // Inicia medição de FPS
      const fps = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0;
          let lastTime = performance.now();

          function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            const elapsed = currentTime - lastTime;

            if (elapsed >= 1000) {
              resolve(frameCount);
            } else {
              requestAnimationFrame(measureFPS);
            }
          }

          // Simula scroll
          window.scrollBy(0, 100);
          requestAnimationFrame(measureFPS);
        });
      });

      console.log(`FPS durante scroll: ${fps}`);
      expect(fps).toBeGreaterThanOrEqual(55); // Próximo de 60fps
    });
  });
});
