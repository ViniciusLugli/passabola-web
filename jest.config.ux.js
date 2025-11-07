/**
 * Configuração do Jest para testes dos componentes UX
 * @see docs/TESTING-COMMIT-5.md
 */

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Caminho para o app Next.js
  dir: "./",
});

const customJestConfig = {
  // Ambiente de teste
  testEnvironment: "jest-environment-jsdom",

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Padrões de teste
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // Cobertura de código
  collectCoverageFrom: [
    "app/components/ui/ErrorState.jsx",
    "app/components/ui/LoadingSkeleton.jsx",
    "app/components/ui/EmptyState.jsx",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  // Threshold de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Module name mapper para aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Transform
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },

  // Ignora node_modules exceto lucide-react
  transformIgnorePatterns: ["node_modules/(?!(lucide-react)/)"],

  // Timeout
  testTimeout: 10000,

  // Reporters
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "PassaBola - Testes UX Components",
        outputPath: "./test-reports/ux-components.html",
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],

  // Configurações de snapshot
  snapshotSerializers: ["jest-serializer-html"],
};

module.exports = createJestConfig(customJestConfig);
