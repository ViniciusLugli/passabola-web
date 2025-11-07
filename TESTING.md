# 🧪 Guia de Testes - PassaBola

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tipos de Testes](#tipos-de-testes)
- [Comandos](#comandos)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Cobertura de Testes](#cobertura-de-testes)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este projeto possui uma suíte abrangente de testes que garantem:
- **70%+** de cobertura de código
- **WCAG 2.1 AA** conformidade de acessibilidade
- **Lighthouse 90+** scores de performance
- **Responsividade** de 320px a 1920px
- **Consistência visual** entre temas light/dark

### Stack de Testes

| Ferramenta | Propósito |
|------------|-----------|
| **Vitest** | Testes unitários e de integração |
| **@testing-library/react** | Testes de componentes React |
| **Playwright** | Testes E2E, responsivos e de performance |
| **@testing-library/jest-dom** | Matchers customizados para DOM |

---

## 🧩 Tipos de Testes

### 1. Testes Funcionais (Vitest)

Testam a lógica e comportamento de componentes individuais.

**Localização:** `__tests__/`

**Exemplos:**
- `__tests__/components/Button.test.jsx`
- `__tests__/components/Modal.test.jsx`
- `__tests__/context/AuthContext.test.jsx`

**O que testam:**
- ✅ Renderização de componentes
- ✅ Props e variantes
- ✅ Interatividade (clicks, inputs)
- ✅ Estados (loading, disabled, error)
- ✅ Acessibilidade (ARIA, roles)
- ✅ Context providers e hooks

### 2. Testes de Responsividade (Playwright)

Validam layouts em diferentes tamanhos de tela.

**Localização:** `tests/responsive.spec.js`

**Breakpoints testados:**
- 📱 Mobile S: 320px
- 📱 Mobile M: 375px
- 📱 Mobile L: 425px
- 📱 Tablet: 768px
- 💻 Laptop: 1024px
- 🖥️ Desktop: 1920px

**O que testam:**
- ✅ Sem scroll horizontal
- ✅ Touch targets mínimos (44x44px)
- ✅ Grids responsivos
- ✅ Navegação mobile vs desktop
- ✅ Orientação portrait/landscape

### 3. Testes de Tema (Playwright)

Garantem consistência visual entre temas light/dark.

**Localização:** `tests/theme.spec.js`

**O que testam:**
- ✅ Troca de tema
- ✅ Persistência no localStorage
- ✅ Respeito à preferência do sistema
- ✅ Cores corretas por componente
- ✅ Contraste WCAG AA (4.5:1 e 3:1)
- ✅ Screenshots comparativos

### 4. Testes de Performance (Playwright)

Medem métricas de performance e validam budgets.

**Localização:** `tests/performance.spec.js`

**Métricas validadas:**
- ⚡ FCP < 1.8s
- ⚡ LCP < 2.5s
- ⚡ TBT < 200ms
- ⚡ CLS < 0.1
- ⚡ Bundle size < 500KB (JS), < 100KB (CSS)
- ⚡ Sem long tasks (> 50ms)
- ⚡ 60fps em scroll

### 5. Testes de Acessibilidade (Vitest + Playwright)

Garantem conformidade WCAG 2.1 AA.

**Localização:** `__tests__/accessibility/`

**O que testam:**
- ♿ ARIA roles e labels
- ♿ Navegação por teclado
- ♿ Focus management
- ♿ Screen reader compatibility
- ♿ Contraste de cores
- ♿ Touch target sizes

---

## 🚀 Comandos

### Testes Unitários (Vitest)

```bash
# Rodar todos os testes unitários
npm test

# Watch mode (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage

# UI interativa
npm run test:ui
```

### Testes E2E (Playwright)

```bash
# Rodar todos os testes E2E
npm run test:e2e

# UI interativa (debug)
npm run test:e2e:ui

# Apenas responsividade
npx playwright test tests/responsive.spec.js

# Apenas tema
npx playwright test tests/theme.spec.js

# Apenas performance
npx playwright test tests/performance.spec.js

# Rodar em um browser específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=mobile-chrome
```

### Relatórios

```bash
# Ver relatório HTML do Vitest
open coverage/index.html

# Ver relatório HTML do Playwright
npx playwright show-report
```

---

## 📁 Estrutura de Pastas

```
passabola-web/
├── __tests__/
│   ├── components/
│   │   ├── Button.test.jsx
│   │   ├── Modal.test.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.test.jsx
│   ├── accessibility/
│   │   └── ux-components.test.jsx
│   ├── performance/
│   │   └── ux-components.test.jsx
│   └── visual/
│       └── ux-components.test.jsx
├── tests/
│   ├── responsive.spec.js
│   ├── theme.spec.js
│   └── performance.spec.js
├── vitest.config.js
├── vitest.setup.js
├── playwright.config.js
└── TESTING.md (este arquivo)
```

---

## 📊 Cobertura de Testes

### Thresholds Configurados

| Métrica | Threshold |
|---------|-----------|
| Statements | 70% |
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

### Arquivos Incluídos

- `app/components/**/*.{js,jsx}`
- `app/context/**/*.{js,jsx}`
- `app/lib/**/*.{js,jsx}`

### Arquivos Excluídos

- `node_modules/`
- `.next/`
- `**/*.test.{js,jsx}`
- `**/*.spec.{js,jsx}`
- `app/components/**/index.{js,jsx}`

### Ver Relatório de Cobertura

```bash
npm run test:coverage
open coverage/index.html
```

---

## 🔄 CI/CD

### GitHub Actions (Futuro)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm test -- --coverage
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🐛 Troubleshooting

### Problema: Testes de componentes falhando

**Sintomas:**
```
Error: useRouter only works in Client Components
```

**Solução:**
- Verificar se o mock do Next.js está configurado em `vitest.setup.js`
- Garantir que componentes client tenham `"use client"` no topo

### Problema: Playwright timeout

**Sintomas:**
```
Test timeout of 30000ms exceeded
```

**Solução:**
```bash
# Aumentar timeout
npx playwright test --timeout=60000

# Ou adicionar ao playwright.config.js
timeout: 60000
```

### Problema: Screenshots diferentes

**Sintomas:**
```
Screenshot comparison failed
```

**Solução:**
```bash
# Atualizar screenshots de referência
npx playwright test --update-snapshots
```

### Problema: Teste de performance falhando

**Sintomas:**
```
Expected FCP < 1800ms, got 2500ms
```

**Solução:**
- Verificar se há processos pesados rodando
- Rodar em modo production: `npm run build && npm start`
- Desabilitar extensões do browser

### Problema: Cobertura baixa

**Sintomas:**
```
Coverage threshold not met
```

**Solução:**
```bash
# Ver arquivos sem cobertura
npm run test:coverage

# Adicionar testes para arquivos específicos
# Focar em branches não cobertas
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Boas Práticas

1. **Teste comportamento, não implementação**
   - Use `getByRole` ao invés de `getByClassName`
   - Teste o que o usuário vê e interage

2. **Evite testes frágeis**
   - Não dependa de estrutura HTML específica
   - Use data-testid apenas quando necessário

3. **Mock com moderação**
   - Mock apenas dependências externas
   - Teste integração real quando possível

4. **Testes rápidos**
   - Evite `waitForTimeout` quando possível
   - Use `waitFor` com condições específicas

5. **Descrições claras**
   - Use `describe` para agrupar testes relacionados
   - Nomes de testes devem ser auto-explicativos

---

## ✅ Checklist de Teste para Novos Componentes

Ao criar um novo componente, certifique-se de:

- [ ] Teste de renderização básica
- [ ] Teste de props e variantes
- [ ] Teste de interatividade (clicks, inputs)
- [ ] Teste de estados (loading, error, disabled)
- [ ] Teste de acessibilidade (ARIA, keyboard)
- [ ] Teste de responsividade (mobile, desktop)
- [ ] Teste em ambos os temas (light, dark)
- [ ] Cobertura > 70%
- [ ] Documentação atualizada

---

## 🎯 Sprint 001 - Commit 6 Status

### ✅ Completado

- [x] Configuração Vitest
- [x] Testes funcionais (Button, Modal, AuthContext)
- [x] Testes de responsividade (6 breakpoints)
- [x] Testes de tema (light/dark, contraste)
- [x] Testes de performance (Web Vitals)
- [x] Cobertura threshold 70%+
- [x] Playwright config atualizado
- [x] Documentação completa

### 📊 Métricas

| Métrica | Target | Status |
|---------|--------|--------|
| Cobertura | 70%+ | ✅ Configurado |
| Testes Unitários | 3+ componentes | ✅ 3 arquivos |
| Testes E2E | 3 tipos | ✅ Responsivo, Tema, Performance |
| Documentação | Completa | ✅ TESTING.md |

---

**Última Atualização:** 2025-11-05
**Sprint:** SPRINT-001-UX-IMPROVEMENTS
**Commit:** 6 - Testing Implementation
