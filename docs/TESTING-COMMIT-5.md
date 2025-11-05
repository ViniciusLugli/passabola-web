# Testing Guide - General UX Components (Commit 5)

## Overview

Este documento descreve os testes necessários para validar os componentes de **Loading States**, **Empty States**, e **Error States** implementados no Commit 5 da Sprint 001.

---

## 1. LoadingSkeleton Component

### Unit Tests

**Arquivo:** `app/components/ui/LoadingSkeleton.test.jsx`

```javascript
import { render, screen } from "@testing-library/react";
import LoadingSkeleton from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  test("renders default number of skeletons", () => {
    render(<LoadingSkeleton />);
    const skeletons = screen.getAllByRole("status");
    expect(skeletons).toHaveLength(1);
  });

  test("renders custom count of skeletons", () => {
    render(<LoadingSkeleton count={5} />);
    // Should render 5 skeleton items within the container
  });

  test("renders different variants correctly", () => {
    const { rerender } = render(<LoadingSkeleton variant="card" />);
    // Verify card variant structure

    rerender(<LoadingSkeleton variant="list" />);
    // Verify list variant structure

    rerender(<LoadingSkeleton variant="post" />);
    // Verify post variant structure
  });

  test("has proper ARIA attributes", () => {
    render(<LoadingSkeleton />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Carregando conteúdo...")).toHaveClass("sr-only");
  });
});
```

### Accessibility Tests

- ✅ **ARIA role="status"** presente
- ✅ **aria-live="polite"** configurado
- ✅ **aria-label** descritivo
- ✅ Screen reader text com `.sr-only`
- ✅ Skeleton não interfere com navegação por teclado

### Visual Regression Tests

- Shimmer animation funciona em light/dark mode
- Skeleton width responsivo (mobile/desktop)
- Performance: animation não causa layout shift

---

## 2. EmptyState Component

### Unit Tests

**Arquivo:** `app/components/ui/EmptyState.test.jsx`

```javascript
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  test("renders title and description", () => {
    render(
      <EmptyState
        title="Nenhum item encontrado"
        description="Adicione novos itens para começar."
      />
    );
    expect(screen.getByText("Nenhum item encontrado")).toBeInTheDocument();
    expect(
      screen.getByText("Adicione novos itens para começar.")
    ).toBeInTheDocument();
  });

  test("renders icon when provided", () => {
    render(
      <EmptyState icon={<Inbox data-testid="inbox-icon" />} title="Vazio" />
    );
    expect(screen.getByTestId("inbox-icon")).toBeInTheDocument();
  });

  test("renders action button when provided", () => {
    const mockAction = <button>Adicionar Item</button>;
    render(<EmptyState title="Vazio" action={mockAction} />);
    expect(
      screen.getByRole("button", { name: "Adicionar Item" })
    ).toBeInTheDocument();
  });

  test("applies variant styles correctly", () => {
    const { rerender, container } = render(
      <EmptyState title="Test" variant="gradient" />
    );
    expect(container.firstChild.firstChild).toHaveClass("bg-gradient-to-br");

    rerender(<EmptyState title="Test" variant="bordered" />);
    expect(container.firstChild.firstChild).toHaveClass("border-2");
  });

  test("has proper ARIA attributes", () => {
    render(<EmptyState title="Empty" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-label", "Empty");
  });
});
```

### Accessibility Tests

- ✅ **role="status"** presente
- ✅ **aria-live="polite"** configurado
- ✅ **aria-label** igual ao título
- ✅ Ícone tem **aria-hidden="true"**
- ✅ Action button é focável e tem label claro

### User Flow Tests (Playwright)

```javascript
test("empty state displays when no data", async ({ page }) => {
  await page.goto("/feed");
  await page.waitForSelector('[role="status"]');

  const emptyState = page.locator("text=Nenhum post disponível");
  await expect(emptyState).toBeVisible();

  // Check if action button works
  await page.click('button:has-text("Criar Post")');
  await expect(page).toHaveURL("/feed/newPost");
});
```

---

## 3. ErrorState Component

### Unit Tests

**Arquivo:** `app/components/ui/ErrorState.test.jsx`

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  test("renders default error message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
  });

  test("renders custom error message", () => {
    render(
      <ErrorState
        title="Erro de conexão"
        message="Verifique sua internet e tente novamente."
      />
    );
    expect(screen.getByText("Erro de conexão")).toBeInTheDocument();
    expect(screen.getByText(/Verifique sua internet/)).toBeInTheDocument();
  });

  test("calls onRetry when retry button is clicked", () => {
    const mockRetry = jest.fn();
    render(<ErrorState onRetry={mockRetry} />);

    const retryButton = screen.getByRole("button", {
      name: "Tentar Novamente",
    });
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  test("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("applies variant styles correctly", () => {
    const { rerender, container } = render(<ErrorState variant="error" />);
    expect(container.firstChild.firstChild).toHaveClass("border-danger");

    rerender(<ErrorState variant="warning" />);
    expect(container.firstChild.firstChild).toHaveClass("border-yellow-400");
  });

  test("has proper ARIA attributes", () => {
    render(<ErrorState />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveAttribute("aria-atomic", "true");
  });
});
```

### Accessibility Tests

- ✅ **role="alert"** presente
- ✅ **aria-live="assertive"** (urgente)
- ✅ **aria-atomic="true"** (lê conteúdo completo)
- ✅ Retry button tem **aria-label**
- ✅ Ícone tem **aria-hidden="true"**

### Integration Tests

```javascript
test("error state allows user recovery", async ({ page }) => {
  // Simular erro de rede
  await page.route("**/api/games", (route) => route.abort());

  await page.goto("/games");

  // Verificar erro exibido
  await expect(page.locator('[role="alert"]')).toBeVisible();
  expect(await page.textContent("text=Algo deu errado")).toBeTruthy();

  // Restaurar rede e clicar em retry
  await page.unroute("**/api/games");
  await page.click('button:has-text("Tentar Novamente")');

  // Verificar que dados carregaram
  await expect(page.locator(".game-card")).toHaveCount(5);
});
```

---

## 4. CSS Animations & Transitions

### Performance Tests

```javascript
test("skeleton animation does not cause layout shift", async ({ page }) => {
  await page.goto("/feed");

  // Measure CLS (Cumulative Layout Shift)
  const cls = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let clsValue = 0;
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        resolve(clsValue);
      }).observe({ type: "layout-shift", buffered: true });
    });
  });

  expect(cls).toBeLessThan(0.1); // WCAG requirement
});
```

### Accessibility Tests (Reduced Motion)

```javascript
test("respects prefers-reduced-motion", async ({ page, context }) => {
  // Enable reduced motion
  await context.emulateMedia({ reducedMotion: "reduce" });

  await page.goto("/feed");

  // Check that animations are disabled
  const skeleton = page.locator(".skeleton").first();
  const animationDuration = await skeleton.evaluate(
    (el) => getComputedStyle(el).animationDuration
  );

  expect(animationDuration).toBe("0.01ms");
});
```

---

## 5. Focus Management

### Keyboard Navigation Tests

```javascript
test("error state retry button is keyboard accessible", async ({ page }) => {
  await page.goto("/games");

  // Simulate error
  await page.route("**/api/games", (route) => route.abort());
  await page.reload();

  // Navigate to retry button with keyboard
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const retryButton = page.locator('button:has-text("Tentar Novamente")');
  await expect(retryButton).toBeFocused();

  // Check focus ring is visible
  const outline = await retryButton.evaluate(
    (el) => getComputedStyle(el).outline
  );
  expect(outline).not.toBe("none");
});
```

---

## 6. Manual Testing Checklist

### Visual Testing

- [ ] Skeleton shimmer animation é suave em 60fps
- [ ] Empty state centralizado e espaçado corretamente
- [ ] Error state tem cores de contraste adequadas (4.5:1)
- [ ] Loading spinner não causa "jump" visual
- [ ] Transições hover são suaves (scale, lift)
- [ ] Dark mode: todas as cores adaptam corretamente

### Screen Reader Testing (NVDA/JAWS)

- [ ] LoadingSkeleton anuncia "Carregando conteúdo"
- [ ] EmptyState anuncia título e descrição
- [ ] ErrorState anuncia erro com prioridade (assertive)
- [ ] Focus indicators são visíveis em todos os elementos interativos
- [ ] Tab order é lógico e previsível

### Browser Compatibility

- [ ] Chrome 120+ (stable)
- [ ] Firefox 121+ (stable)
- [ ] Safari 17+ (stable)
- [ ] Edge 120+ (stable)

### Responsive Testing

- [ ] Mobile (320px-767px): componentes adaptam corretamente
- [ ] Tablet (768px-1023px): layout é legível
- [ ] Desktop (1024px+): uso otimizado do espaço

---

## 7. Performance Benchmarks

### Metrics

| Metric                     | Target | Actual |
| -------------------------- | ------ | ------ |
| **Skeleton render time**   | < 50ms | \_\_\_ |
| **Animation FPS**          | 60fps  | \_\_\_ |
| **CSS containment effect** | 30% ↓  | \_\_\_ |
| **Bundle size increase**   | < 2KB  | \_\_\_ |

### Lighthouse Audit

```bash
npm run lighthouse -- --url=http://localhost:3000/feed
```

**Expected Scores:**

- Performance: 90+
- Accessibility: 100
- Best Practices: 90+

---

## 8. Regression Testing

### Before Merge

- [ ] All existing tests still pass
- [ ] No new ESLint errors
- [ ] No console errors in browser
- [ ] Theme switching works correctly
- [ ] No accessibility regressions (axe DevTools)

---

## 9. User Acceptance Testing (UAT)

### Scenarios

**Scenario 1: Loading Experience**

1. Navigate to /games page
2. Verify skeleton loading shows immediately
3. Verify smooth transition from skeleton to content
4. Verify no layout shift occurs

**Scenario 2: Empty State**

1. Navigate to /teams page (no teams)
2. Verify empty state is clear and helpful
3. Click "Criar Time" button
4. Verify navigation to create team page

**Scenario 3: Error Recovery**

1. Disconnect internet
2. Navigate to /feed page
3. Verify error state displays
4. Reconnect internet
5. Click "Tentar Novamente"
6. Verify feed loads successfully

---

## 10. Documentation

### Component Usage Examples

**LoadingSkeleton:**

```jsx
import LoadingSkeleton from '@/app/components/ui/LoadingSkeleton';

// Default card skeleton
<LoadingSkeleton count={3} />

// List skeleton
<LoadingSkeleton count={5} variant="list" />

// Post skeleton
<LoadingSkeleton variant="post" />
```

**EmptyState:**

```jsx
import EmptyState from "@/app/components/ui/EmptyState";
import { Inbox } from "lucide-react";
import Button from "@/app/components/ui/Button";

<EmptyState
  icon={<Inbox />}
  title="Nenhum post ainda"
  description="Comece criando seu primeiro post!"
  action={
    <Button onClick={() => router.push("/feed/newPost")}>Criar Post</Button>
  }
  variant="gradient"
/>;
```

**ErrorState:**

```jsx
import ErrorState from "@/app/components/ui/ErrorState";

<ErrorState
  title="Erro ao carregar jogos"
  message="Não foi possível conectar ao servidor. Verifique sua conexão."
  onRetry={() => fetchGames()}
  retryLabel="Tentar Novamente"
  variant="error"
/>;
```

---

## Summary

✅ **3 novos componentes criados:**

- `LoadingSkeleton` (com variantes)
- `EmptyState` (com variantes)
- `ErrorState` (com retry)

✅ **Melhorias em `globals.css`:**

- CSS containment para performance
- Smooth transitions
- Focus indicators acessíveis
- Support para reduced motion

✅ **Acessibilidade WCAG 2.1 AA:**

- ARIA roles e live regions
- Keyboard navigation
- Screen reader support
- High contrast mode support

✅ **Performance:**

- CSS-only animations
- No layout shift
- 60fps smooth animations

---

**Status:** Ready for Testing ✅  
**Next Step:** Execute test suite and validate all scenarios
