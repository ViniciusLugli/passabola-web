/**
 * Setup do Jest para testes dos componentes UX
 * @see docs/TESTING-COMMIT-5.md
 */

import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";
import { toMatchImageSnapshot } from "jest-image-snapshot";

// Estende matchers do Jest
expect.extend(toHaveNoViolations);
expect.extend({ toMatchImageSnapshot });

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock do matchMedia para testes de reduced motion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do performance.memory (para testes de performance)
Object.defineProperty(performance, "memory", {
  writable: true,
  value: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  },
});

// Mock do window._eventListeners (para testes de memory leaks)
Object.defineProperty(window, "_eventListeners", {
  writable: true,
  value: [],
});

// Suprime warnings do console em testes
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Not implemented: HTMLFormElement.prototype.submit"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Cleanup após cada teste
afterEach(() => {
  jest.clearAllMocks();
  document.documentElement.classList.remove("dark");
});
