# PassaBola Testing Guide

**Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Active

## Overview

This guide outlines the testing strategy, tools, and best practices for the PassaBola project. We employ a multi-layered testing approach to ensure code quality, reliability, and maintainability.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Setup & Installation](#setup--installation)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Accessibility Testing](#accessibility-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the component does, not how it does it
   - Tests should remain valid even if implementation changes

2. **Write Tests First (TDD)**
   - Define expected behavior before implementation
   - Ensures all code has test coverage from the start

3. **Maintainable Tests**
   - Tests should be easy to read and understand
   - Avoid duplication with helper functions
   - Keep tests isolated and independent

4. **Confidence Over Coverage**
   - 100% coverage doesn't mean bug-free code
   - Focus on testing critical paths and user flows
   - Target: 70%+ coverage for core features

---

## Testing Pyramid

```
           /\
          /  \
         / E2E \        ← Few, slow, expensive
        /______\
       /        \
      / Integration \   ← Some, moderate speed
     /______________\
    /                \
   /   Unit Tests     \ ← Many, fast, cheap
  /____________________\
```

### Distribution

- **Unit Tests:** 70% of tests
- **Integration Tests:** 20% of tests
- **E2E Tests:** 10% of tests

---

## Setup & Installation

### Install Testing Dependencies

```bash
# Install Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Install Playwright for E2E testing
npm install --save-dev @playwright/test

# Install accessibility testing tools
npm install --save-dev jest-axe axe-core

# Install coverage reporting
npm install --save-dev @jest/coverage-reporter
```

### Jest Configuration

Create `jest.config.js` in project root:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'app/components/**/*.{js,jsx}',
    'app/context/**/*.{js,jsx}',
    'app/lib/**/*.{js,jsx}',
    '!app/components/**/*.stories.{js,jsx}',
    '!app/components/**/index.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup File

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
```

### Playwright Configuration

Create `playwright.config.js`:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Update package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## Unit Testing

Unit tests focus on testing individual components and functions in isolation.

### Component Testing Example

```javascript
// app/components/ui/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByLabelText('Submit')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-br');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-surface');
  });
});
```

### Testing with User Interactions

```javascript
// app/components/ui/Input.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('updates value when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Input
        label="Email"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when error prop is provided', () => {
    render(
      <Input
        label="Password"
        value=""
        onChange={() => {}}
        error="Senha muito curta"
      />
    );

    expect(screen.getByText('Senha muito curta')).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(
      <Input
        label="Password"
        type="password"
        value="secret123"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText('Mostrar senha');
    await user.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
  });
});
```

### Testing Context Providers

```javascript
// app/context/AuthContext.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the context
const TestComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
          Login
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();

    // Simulate login
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText(/Logged in as/)).toBeInTheDocument();
    });
  });
});
```

### Testing Utility Functions

```javascript
// app/lib/utils.test.js
import { formatDate, truncateText } from './utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-01T12:00:00Z');
    expect(formatDate(date)).toBe('01/01/2025');
  });

  it('handles invalid dates', () => {
    expect(formatDate('invalid')).toBe('Data inválida');
  });
});

describe('truncateText', () => {
  it('truncates text longer than max length', () => {
    const text = 'This is a very long text that should be truncated';
    expect(truncateText(text, 20)).toBe('This is a very long...');
  });

  it('does not truncate text shorter than max length', () => {
    const text = 'Short text';
    expect(truncateText(text, 20)).toBe('Short text');
  });
});
```

---

## Integration Testing

Integration tests verify that multiple components work together correctly.

### Testing Component Integration

```javascript
// app/components/feed/PostList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/app/context/AuthContext';
import { ToastProvider } from '@/app/context/ToastContext';
import PostList from './PostList';

const mockPosts = [
  {
    id: 1,
    authorUsername: 'Ana Silva',
    authorType: 'PLAYER',
    content: 'Great game today!',
    createdAt: '2025-01-01T12:00:00Z',
    totalLikes: 5,
    isLikedByCurrentUser: false,
  },
];

describe('PostList Integration', () => {
  it('renders posts with like functionality', async () => {
    render(
      <AuthProvider>
        <ToastProvider>
          <PostList posts={mockPosts} />
        </ToastProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Great game today!')).toBeInTheDocument();
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();

    // Test like interaction
    const likeButton = screen.getByLabelText('Curtir post');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(screen.getByText('6 Curtidas')).toBeInTheDocument();
    });
  });
});
```

### Testing Forms with Validation

```javascript
// app/components/forms/CreateTeamForm.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTeamForm from './CreateTeamForm';

describe('CreateTeamForm Integration', () => {
  it('validates form and submits data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<CreateTeamForm onSubmit={handleSubmit} />);

    // Try to submit empty form
    await user.click(screen.getByText('Criar Time'));
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Fill form
    await user.type(screen.getByLabelText('Nome do Time'), 'Time das Leoas');
    await user.type(screen.getByLabelText('Descrição'), 'Time de São Paulo');
    await user.selectOptions(screen.getByLabelText('Categoria'), 'FEMININO');

    // Submit form
    await user.click(screen.getByText('Criar Time'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Time das Leoas',
        description: 'Time de São Paulo',
        category: 'FEMININO',
      });
    });
  });
});
```

---

## End-to-End Testing

E2E tests simulate real user scenarios across the entire application.

### Basic E2E Test Example

```javascript
// tests/e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register, login, and logout', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.selectOption('select[name="userType"]', 'PLAYER');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to feed
    await expect(page).toHaveURL('/feed');
    await expect(page.locator('text=Bem-vindo')).toBeVisible();

    // Logout
    await page.click('button[aria-label="Menu do usuário"]');
    await page.click('text=Sair');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');
  });
});
```

### Testing User Flows

```javascript
// tests/e2e/create-post.spec.js
import { test, expect } from '@playwright/test';

test.describe('Create Post Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/feed');
  });

  test('user can create a text post', async ({ page }) => {
    // Open create post modal
    await page.click('text=Criar Post');

    // Fill content
    await page.fill('textarea[name="content"]', 'Meu primeiro post!');

    // Submit
    await page.click('button:has-text("Publicar")');

    // Verify post appears in feed
    await expect(page.locator('text=Meu primeiro post!')).toBeVisible();
  });

  test('user can create a post with image', async ({ page }) => {
    await page.click('text=Criar Post');

    await page.fill('textarea[name="content"]', 'Post com imagem!');

    // Upload image
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/image.jpg');

    await page.click('button:has-text("Publicar")');

    // Verify image is displayed
    await expect(page.locator('img[alt="Imagem da publicação"]')).toBeVisible();
  });
});
```

### Testing Responsive Behavior

```javascript
// tests/e2e/responsive.spec.js
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('chat layout adapts to mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/chat');

    // Verify mobile layout
    const conversationList = page.locator('[data-testid="conversation-list"]');
    const messageArea = page.locator('[data-testid="message-area"]');

    // Initially, only conversation list is visible
    await expect(conversationList).toBeVisible();
    await expect(messageArea).not.toBeVisible();

    // Click on a conversation
    await page.click('[data-testid="conversation-item"]:first-child');

    // Now message area is visible, conversation list is hidden
    await expect(conversationList).not.toBeVisible();
    await expect(messageArea).toBeVisible();

    // Click back button
    await page.click('button[aria-label="Voltar para conversas"]');

    // Back to conversation list
    await expect(conversationList).toBeVisible();
    await expect(messageArea).not.toBeVisible();

    await context.close();
  });
});
```

---

## Accessibility Testing

### Automated Accessibility Tests

```javascript
// app/components/ui/Button.test.jsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Button from './Button';

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click Me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has accessible loading state', async () => {
    const { container } = render(<Button loading>Loading</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation Tests

```javascript
// tests/e2e/keyboard-navigation.spec.js
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('user can navigate form with keyboard', async ({ page }) => {
    await page.goto('/register');

    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="name"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="email"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="password"]')).toBeFocused();

    // Submit with Enter key
    await page.keyboard.press('Enter');
  });

  test('modal can be closed with Escape key', async ({ page }) => {
    await page.goto('/feed');

    await page.click('text=Criar Post');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
```

### Screen Reader Testing

While automated tools can catch many issues, manual testing with screen readers is essential:

1. **NVDA (Windows)**
   - Download from https://www.nvaccess.org/
   - Test navigation, form completion, dynamic updates

2. **VoiceOver (macOS)**
   - Built-in (Cmd+F5 to enable)
   - Test with Safari for best compatibility

3. **Checklist:**
   - [ ] All interactive elements are announced
   - [ ] Form labels are associated correctly
   - [ ] Error messages are announced
   - [ ] Dynamic content updates are announced
   - [ ] Navigation landmarks are identified

---

## Visual Regression Testing

Visual regression tests catch unintended UI changes.

### Using Playwright Screenshots

```javascript
// tests/e2e/visual-regression.spec.js
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('feed page matches screenshot', async ({ page }) => {
    await page.goto('/feed');

    // Wait for content to load
    await page.waitForSelector('[data-testid="post-card"]');

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('feed-page.png');
  });

  test('notification card matches screenshot', async ({ page }) => {
    await page.goto('/notifications');

    const notificationCard = page.locator('[data-testid="notification-card"]').first();
    await expect(notificationCard).toHaveScreenshot('notification-card.png');
  });
});
```

### Update Snapshots

```bash
# Update all screenshots
npm run test:e2e -- --update-snapshots

# Update specific test
npm run test:e2e visual-regression.spec.js --update-snapshots
```

---

## Performance Testing

### Lighthouse CI

Create `.lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/feed'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

Run Lighthouse:

```bash
npx lighthouse-ci autorun
```

### Performance Budget

```javascript
// tests/e2e/performance.spec.js
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/feed');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Assert load time is under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('bundle size is within budget', async ({ page }) => {
    const response = await page.goto('/feed');
    const size = parseInt(response.headers()['content-length'] || '0');

    // Assert page size is under 500KB
    expect(size).toBeLessThan(500000);
  });
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

---

## Best Practices

### DO

- ✅ Write tests for critical user paths
- ✅ Test edge cases and error states
- ✅ Use data-testid for elements that change frequently
- ✅ Mock external API calls
- ✅ Keep tests independent and isolated
- ✅ Use descriptive test names
- ✅ Test accessibility in every component
- ✅ Run tests in CI/CD pipeline

### DON'T

- ❌ Test implementation details
- ❌ Write overly specific assertions
- ❌ Rely on test order (tests should be independent)
- ❌ Use timeouts instead of proper waiting
- ❌ Skip tests to make CI pass
- ❌ Commit commented-out tests
- ❌ Test third-party libraries

### Test Naming Convention

```javascript
describe('ComponentName', () => {
  it('renders correctly with default props', () => {});
  it('calls onClick handler when clicked', () => {});
  it('shows error message when error prop is provided', () => {});
});
```

---

## Troubleshooting

### Common Issues

**Issue:** Tests fail with "Cannot find module '@/...'"

**Solution:** Ensure `moduleNameMapper` is configured in `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

**Issue:** `useRouter is not a function`

**Solution:** Mock Next.js router in `jest.setup.js` (see Setup section)

**Issue:** Playwright tests fail with timeout

**Solution:** Increase timeout or use proper waiting:
```javascript
await page.waitForSelector('[data-testid="element"]', { timeout: 10000 });
```

**Issue:** Tests pass locally but fail in CI

**Solution:**
- Check for timing issues
- Ensure CI has all dependencies installed
- Use `waitFor` instead of fixed delays

---

## Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [jest-axe](https://github.com/nickcolley/jest-axe)

### Tutorials

- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [E2E Testing Guide](https://playwright.dev/docs/writing-tests)
- [Accessibility Testing](https://www.deque.com/axe/devtools/)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-04 | Initial testing guide |

---

**Maintained by:** PassaBola Development Team
**Questions?** Open a GitHub Discussion or contact the QA lead.
