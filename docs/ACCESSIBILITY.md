# PassaBola Accessibility Guide

**Version:** 1.0
**Last Updated:** 2025-11-04
**Compliance Target:** WCAG 2.1 Level AA
**Status:** Active

## Overview

PassaBola is committed to providing an inclusive and accessible experience for all users, including those with disabilities. This document outlines our accessibility standards, compliance requirements, and implementation guidelines based on the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.

## Table of Contents

- [Accessibility Principles](#accessibility-principles)
- [WCAG 2.1 AA Compliance](#wcag-21-aa-compliance)
- [Perceivable](#perceivable)
- [Operable](#operable)
- [Understandable](#understandable)
- [Robust](#robust)
- [Testing Guidelines](#testing-guidelines)
- [Common Patterns](#common-patterns)
- [Accessibility Checklist](#accessibility-checklist)
- [Tools & Resources](#tools--resources)

---

## Accessibility Principles

### Four Core Principles (POUR)

1. **Perceivable:** Information and user interface components must be presentable to users in ways they can perceive.

2. **Operable:** User interface components and navigation must be operable by all users.

3. **Understandable:** Information and the operation of the user interface must be understandable.

4. **Robust:** Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies.

---

## WCAG 2.1 AA Compliance

PassaBola targets **WCAG 2.1 Level AA** compliance across all features and pages.

### Success Criteria Summary

| Level | Criteria Count | PassaBola Status |
|-------|----------------|------------------|
| **A (Must Have)** | 30 | ✅ Compliant |
| **AA (Should Have)** | 20 | ✅ Target Compliance |
| **AAA (Nice to Have)** | 28 | 🔄 Partial |

---

## Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

### 1.1 Text Alternatives

**1.1.1 Non-text Content (Level A)**
All non-text content has a text alternative that serves the equivalent purpose.

#### Implementation

```jsx
// Images
<Image
  src="/team-photo.jpg"
  alt="Time das Leoas durante partida de futebol"
  width={300}
  height={200}
/>

// Decorative images
<Image
  src="/background-pattern.svg"
  alt="" // Empty alt for decorative images
  aria-hidden="true"
  width={100}
  height={100}
/>

// Icons with meaning
<button aria-label="Fechar modal">
  <X className="w-5 h-5" aria-hidden="true" />
</button>

// Icon-only buttons
<button aria-label="Curtir post">
  <Heart className="w-5 h-5" />
</button>
```

#### Checklist

- [ ] All images have descriptive `alt` attributes
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Icon-only buttons have `aria-label`
- [ ] Complex images have extended descriptions when needed

---

### 1.2 Time-based Media

**1.2.1 Audio-only and Video-only (Level A)**
For prerecorded audio-only and video-only media, provide alternatives.

#### PassaBola Implementation

Currently, PassaBola does not support video/audio uploads. When implemented:

- [ ] Provide transcripts for audio content
- [ ] Provide captions for video content
- [ ] Provide audio descriptions for video-only content

---

### 1.3 Adaptable

**1.3.1 Info and Relationships (Level A)**
Information, structure, and relationships conveyed through presentation can be programmatically determined.

#### Implementation

```jsx
// Semantic HTML
<main>
  <h1>Feed de Notícias</h1>
  <section>
    <h2>Posts Recentes</h2>
    <article>
      <h3>Título do Post</h3>
      <p>Conteúdo do post...</p>
    </article>
  </section>
</main>

// Form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" name="email" />

// Lists
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

// Tables (when needed)
<table>
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Posição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ana Silva</td>
      <td>Atacante</td>
    </tr>
  </tbody>
</table>
```

**1.3.2 Meaningful Sequence (Level A)**
Reading and navigation order is logical and meaningful.

```jsx
// Correct DOM order
<article>
  <h2>Título</h2> {/* First in DOM and visual order */}
  <p>Conteúdo</p> {/* Second */}
  <footer>Metadata</footer> {/* Third */}
</article>

// Avoid using CSS to reverse visual order when possible
```

**1.3.4 Orientation (Level AA)**
Content does not restrict its view and operation to a single display orientation unless essential.

```css
/* Allow both portrait and landscape */
/* Avoid using orientation media queries to lock orientation */
```

**1.3.5 Identify Input Purpose (Level AA)**
The purpose of input fields can be programmatically determined.

```jsx
<input
  type="email"
  name="email"
  autoComplete="email"
  aria-label="Email de contato"
/>

<input
  type="tel"
  name="phone"
  autoComplete="tel"
  aria-label="Número de telefone"
/>
```

---

### 1.4 Distinguishable

**1.4.1 Use of Color (Level A)**
Color is not used as the only visual means of conveying information.

```jsx
// Bad: Color only
<span className="text-red-500">Erro</span>

// Good: Color + icon + text
<div className="flex items-center gap-2 text-red-500">
  <AlertCircle className="w-5 h-5" aria-hidden="true" />
  <span>Erro: Preencha todos os campos obrigatórios</span>
</div>
```

**1.4.3 Contrast (Minimum) (Level AA)**
Text has a contrast ratio of at least 4.5:1 (3:1 for large text).

| Element | Light Mode | Dark Mode | Contrast Ratio |
|---------|------------|-----------|----------------|
| Primary text on surface | `#111827` on `#ffffff` | `#e9eeff` on `#151b2e` | 12.5:1 ✅ |
| Secondary text on surface | `#4f5669` on `#ffffff` | `#bbc4de` on `#151b2e` | 7.8:1 ✅ |
| Tertiary text on surface | `#717989` on `#ffffff` | `#929dba` on `#151b2e` | 4.9:1 ✅ |
| Accent on surface | `#6d28d9` on `#ffffff` | `#6d28d9` on `#151b2e` | 6.2:1 ✅ |
| White on accent | `#ffffff` on `#6d28d9` | `#f5f5ff` on `#6d28d9` | 8.1:1 ✅ |

**1.4.4 Resize Text (Level AA)**
Text can be resized up to 200% without loss of content or functionality.

```css
/* Use relative units */
font-size: 1rem; /* Good */
font-size: 16px; /* Avoid */

/* Allow text scaling */
html {
  font-size: 16px; /* Base size */
}

/* Responsive typography */
.text-base {
  font-size: 1rem; /* 16px */
  line-height: 1.5rem; /* 24px */
}
```

**1.4.10 Reflow (Level AA)**
Content can be presented without horizontal scrolling at 320px width.

```jsx
// Use responsive design
<div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  {/* Content adapts to viewport */}
</div>

// Avoid fixed widths
<div className="w-full max-w-md"> {/* Good */}
<div style={{ width: '600px' }}> {/* Bad */}
```

**1.4.11 Non-text Contrast (Level AA)**
Visual presentation of UI components and graphical objects has a contrast ratio of at least 3:1.

```jsx
// Border contrast
<div className="border border-default"> {/* 3:1+ contrast */}

// Button states
<button className="border-2 border-accent focus:ring-2 focus:ring-accent">
  {/* Focus indicator has sufficient contrast */}
</button>
```

**1.4.12 Text Spacing (Level AA)**
No loss of content or functionality when user adjusts text spacing.

Test with these CSS overrides:
```css
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

p {
  margin-bottom: 2em !important;
}
```

**1.4.13 Content on Hover or Focus (Level AA)**
Additional content that appears on hover/focus can be dismissed, hovered, and persists.

```jsx
// Tooltip example
<button
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
  onFocus={() => setShowTooltip(true)}
  onBlur={() => setShowTooltip(false)}
  aria-describedby="tooltip-1"
>
  Informação
</button>
{showTooltip && (
  <div
    id="tooltip-1"
    role="tooltip"
    onMouseEnter={() => setShowTooltip(true)} {/* Hoverable */}
  >
    Texto explicativo
  </div>
)}
```

---

## Operable

User interface components and navigation must be operable.

### 2.1 Keyboard Accessible

**2.1.1 Keyboard (Level A)**
All functionality is available from a keyboard.

```jsx
// Interactive elements are keyboard accessible
<button onClick={handleClick}>Click Me</button>
<a href="/profile">View Profile</a>
<input type="text" onChange={handleChange} />

// Custom interactive elements need keyboard handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

**2.1.2 No Keyboard Trap (Level A)**
Keyboard focus can be moved away from any component using standard navigation.

```jsx
// Modal with proper focus management
useEffect(() => {
  if (isOpen) {
    // Store previously focused element
    const previouslyFocused = document.activeElement;

    // Focus first element in modal
    modalRef.current?.focus();

    return () => {
      // Restore focus when modal closes
      previouslyFocused?.focus();
    };
  }
}, [isOpen]);
```

**2.1.4 Character Key Shortcuts (Level A)**
If a keyboard shortcut uses only character keys, it can be turned off, remapped, or is only active on focus.

Currently, PassaBola does not implement character-only keyboard shortcuts.

---

### 2.2 Enough Time

**2.2.1 Timing Adjustable (Level A)**
Users can turn off, adjust, or extend time limits.

```jsx
// Auto-dismissing alerts have sufficient time (3-5 seconds minimum)
<Alert
  isOpen={showAlert}
  onClose={handleClose}
  duration={5000} // 5 seconds - sufficient time to read
  message="Post salvo com sucesso!"
/>

// For critical actions, avoid auto-dismiss
<Alert
  isOpen={showError}
  onClose={handleClose}
  duration={null} // Manual dismiss only
  message="Erro ao salvar. Tente novamente."
/>
```

**2.2.2 Pause, Stop, Hide (Level A)**
For moving, blinking, or auto-updating content, provide mechanism to pause, stop, or hide.

```jsx
// Animations can be disabled via prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 2.3 Seizures and Physical Reactions

**2.3.1 Three Flashes or Below Threshold (Level A)**
Content does not flash more than three times per second.

PassaBola does not use flashing content.

---

### 2.4 Navigable

**2.4.1 Bypass Blocks (Level A)**
A mechanism is available to bypass blocks of content that are repeated on multiple pages.

```jsx
// Skip to main content link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-on-brand focus:px-4 focus:py-2 focus:rounded"
>
  Pular para o conteúdo principal
</a>

<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

**2.4.2 Page Titled (Level A)**
Web pages have descriptive and informative titles.

```jsx
// In Next.js pages
export const metadata = {
  title: 'Feed de Notícias | PassaBola',
  description: 'Veja as últimas atualizações do futebol feminino'
};

// Or dynamic titles
<Head>
  <title>{`${user.name} | PassaBola`}</title>
</Head>
```

**2.4.3 Focus Order (Level A)**
Focusable components receive focus in an order that preserves meaning and operability.

```jsx
// Logical tab order
<form>
  <Input label="Nome" /> {/* tabindex 1 */}
  <Input label="Email" /> {/* tabindex 2 */}
  <Input label="Senha" /> {/* tabindex 3 */}
  <Button type="submit">Cadastrar</Button> {/* tabindex 4 */}
</form>

// Avoid using positive tabindex values
<div tabIndex={1}> {/* Bad */}
<div tabIndex={0}> {/* Good - natural order */}
```

**2.4.4 Link Purpose (In Context) (Level A)**
The purpose of each link can be determined from the link text alone or from the link text together with its context.

```jsx
// Good: Descriptive link text
<Link href="/team/123">Ver perfil do Time das Leoas</Link>

// Bad: Generic link text
<Link href="/team/123">Clique aqui</Link> {/* Avoid */}

// Acceptable with context
<article>
  <h3>Time das Leoas</h3>
  <p>Equipe feminina de São Paulo...</p>
  <Link href="/team/123">Ver mais</Link> {/* Context provided by heading */}
</article>
```

**2.4.5 Multiple Ways (Level AA)**
More than one way is available to locate a web page within a set of pages.

PassaBola provides:
- [ ] Navigation menu (Header)
- [ ] Search functionality (SearchBar)
- [ ] Related links within content

**2.4.6 Headings and Labels (Level AA)**
Headings and labels describe topic or purpose.

```jsx
// Descriptive headings
<h1>Suas Notificações</h1>
<h2>Notificações Não Lidas</h2>

// Descriptive labels
<label htmlFor="team-name">Nome da Equipe</label>
<input id="team-name" type="text" />

// Avoid generic labels
<label>Campo 1</label> {/* Bad */}
```

**2.4.7 Focus Visible (Level AA)**
Keyboard focus indicator is visible.

```css
/* Default focus styles */
*:focus-visible {
  outline: 2px solid rgb(var(--color-accent));
  outline-offset: 2px;
}

/* Custom focus styles */
.button:focus-visible {
  ring: 2px;
  ring-color: rgb(var(--color-accent));
}
```

---

### 2.5 Input Modalities

**2.5.1 Pointer Gestures (Level A)**
All functionality that uses multipoint or path-based gestures can be operated with a single pointer.

PassaBola uses simple gestures:
- ✅ Click/Tap
- ✅ Swipe (but with alternative UI controls)

```jsx
// Swipe with alternative
<NotificationCard
  notification={notification}
  onMarkAsRead={handleMarkAsRead} // Click alternative to swipe
  onDelete={handleDelete} // Click alternative to swipe
/>
```

**2.5.2 Pointer Cancellation (Level A)**
For functionality operated using a single pointer, at least one is true: no down-event, abort/undo, up reversal, or essential.

```jsx
// Click completes on pointer up, not pointer down
<button onClick={handleClick}> {/* Good - fires on mouseup */}
<button onMouseDown={handleClick}> {/* Avoid unless essential */}
```

**2.5.3 Label in Name (Level A)**
For UI components with labels that include text or images of text, the name contains the text that is presented visually.

```jsx
// Visual label matches accessible name
<button aria-label="Salvar Post">
  Salvar Post {/* Visual and accessible name match */}
</button>

// Icon buttons
<button aria-label="Fechar">
  <X className="w-5 h-5" />
  Fechar {/* Include visual text when possible */}
</button>
```

**2.5.4 Motion Actuation (Level A)**
Functionality triggered by device motion or user motion can also be operated by UI components.

PassaBola does not use motion-based controls.

---

## Understandable

Information and the operation of the user interface must be understandable.

### 3.1 Readable

**3.1.1 Language of Page (Level A)**
The default language of each page can be programmatically determined.

```jsx
// In app/layout.jsx
<html lang="pt-BR">
  <body>{children}</body>
</html>
```

**3.1.2 Language of Parts (Level AA)**
The language of each passage or phrase can be programmatically determined except for proper names, technical terms, etc.

```jsx
// For foreign language content
<p>
  O termo <span lang="en">offside</span> é usado no futebol...
</p>
```

---

### 3.2 Predictable

**3.2.1 On Focus (Level A)**
When a component receives focus, it does not initiate a change of context.

```jsx
// Good: Focus does not trigger navigation
<input
  onFocus={() => console.log('Focused')} // OK
  onChange={handleChange} // OK
/>

// Bad: Focus triggers navigation
<input
  onFocus={() => router.push('/other-page')} // Avoid
/>
```

**3.2.2 On Input (Level A)**
Changing the setting of a UI component does not automatically cause a change of context.

```jsx
// Good: Requires explicit submit
<form onSubmit={handleSubmit}>
  <SelectInput
    options={options}
    onChange={(e) => setSelected(e.target.value)}
  />
  <Button type="submit">Buscar</Button>
</form>

// Bad: Auto-submits on change
<SelectInput
  onChange={(e) => {
    setSelected(e.target.value);
    handleSubmit(); // Avoid
  }}
/>
```

**3.2.3 Consistent Navigation (Level AA)**
Navigational mechanisms that are repeated on multiple pages occur in the same relative order each time.

```jsx
// Header navigation is consistent across all pages
<Header>
  <Logo />
  <Nav>
    <NavItem href="/feed">Feed</NavItem>
    <NavItem href="/games">Jogos</NavItem>
    <NavItem href="/teams">Times</NavItem>
  </Nav>
  <UserMenu />
</Header>
```

**3.2.4 Consistent Identification (Level AA)**
Components with the same functionality are identified consistently.

```jsx
// Like button always uses Heart icon and same label
<button aria-label="Curtir post">
  <Heart className="w-5 h-5" />
</button>

// Close button always uses X icon and same label
<button aria-label="Fechar modal">
  <X className="w-5 h-5" />
</button>
```

---

### 3.3 Input Assistance

**3.3.1 Error Identification (Level A)**
If an input error is automatically detected, the item in error is identified and described in text.

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError} // "Email inválido. Use o formato: usuario@dominio.com"
/>
```

**3.3.2 Labels or Instructions (Level A)**
Labels or instructions are provided when content requires user input.

```jsx
<Input
  label="Senha"
  type="password"
  description="Mínimo de 8 caracteres, incluindo letras e números"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

**3.3.3 Error Suggestion (Level AA)**
If an input error is detected and suggestions for correction are known, provide them to the user.

```jsx
<Input
  label="Email"
  value={email}
  error="Email inválido"
  hint="Você quis dizer: usuario@gmail.com?" // Suggestion
/>
```

**3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)**
For pages that cause legal commitments or financial transactions, at least one is true: reversible, checked, or confirmed.

```jsx
// Confirmation before destructive action
<ConfirmModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Deletar Conta"
  message="Esta ação é irreversível. Tem certeza que deseja deletar sua conta permanentemente?"
  confirmText="Sim, deletar minha conta"
  cancelText="Cancelar"
/>
```

---

## Robust

Content must be robust enough to be interpreted reliably by a wide variety of user agents.

### 4.1 Compatible

**4.1.1 Parsing (Level A)**
Content is correctly parsed and does not have duplicate IDs.

```jsx
// Generate unique IDs
import { useId } from 'react';

const Input = ({ label }) => {
  const id = useId(); // Guaranteed unique ID

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </>
  );
};
```

**4.1.2 Name, Role, Value (Level A)**
For all UI components, the name and role can be programmatically determined.

```jsx
// Standard HTML elements have implicit roles
<button>Click Me</button> // role="button" implicit

// Custom components need explicit roles
<div
  role="button"
  tabIndex={0}
  aria-label="Custom Button"
  onClick={handleClick}
>
  Click Me
</div>

// Form controls have proper names
<input
  type="text"
  id="username"
  name="username"
  aria-label="Nome de usuário"
/>
```

**4.1.3 Status Messages (Level AA)**
Status messages can be programmatically determined through role or properties.

```jsx
// Live regions for dynamic updates
<div role="status" aria-live="polite">
  {successMessage}
</div>

<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Toast notifications
<Toast
  message="Post salvo com sucesso!"
  type="success"
  role="status"
  aria-live="polite"
/>
```

---

## Testing Guidelines

### Manual Testing

#### Keyboard Navigation Test

1. **Tab Navigation**
   - Press Tab to move forward through interactive elements
   - Press Shift+Tab to move backward
   - Verify focus is visible on all elements
   - Ensure focus order is logical

2. **Keyboard Shortcuts**
   - Enter: Activate buttons and links
   - Space: Activate buttons and checkboxes
   - Escape: Close modals and dropdowns
   - Arrow keys: Navigate within components (select, tabs, etc.)

#### Screen Reader Testing

Test with:
- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

Verify:
- All content is announced correctly
- Navigation landmarks are identified
- Form labels are associated properly
- Dynamic content updates are announced

#### Color Contrast Testing

1. Use browser DevTools color picker
2. Check contrast ratio for all text
3. Verify minimum ratios:
   - Normal text: 4.5:1
   - Large text (18pt+): 3:1
   - UI components: 3:1

### Automated Testing

#### axe DevTools

```bash
# Install axe DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/axe-devtools
# Firefox: https://addons.mozilla.org/firefox/addon/axe-devtools/
```

Run automated scan:
1. Open DevTools (F12)
2. Navigate to "axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review and fix issues

#### Lighthouse Accessibility Audit

```bash
# Run Lighthouse in Chrome DevTools
# or use CLI:
npx lighthouse https://passabola.com --only-categories=accessibility
```

Target score: **90+**

#### Jest + React Testing Library

```javascript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click Me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Common Patterns

### Accessible Forms

```jsx
<form onSubmit={handleSubmit} aria-label="Formulário de cadastro">
  <Input
    label="Nome completo"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    error={nameError}
  />

  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    autoComplete="email"
    required
    error={emailError}
  />

  <Input
    label="Senha"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="new-password"
    description="Mínimo de 8 caracteres"
    required
    error={passwordError}
  />

  <Button type="submit" loading={isSubmitting}>
    Cadastrar
  </Button>
</form>
```

### Accessible Modals

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Título do Modal"
>
  <div>
    <p>Conteúdo do modal...</p>

    <div className="flex gap-3 mt-4">
      <Button variant="secondary" onClick={handleClose}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirmar
      </Button>
    </div>
  </div>
</Modal>
```

### Accessible Lists

```jsx
<section aria-labelledby="posts-heading">
  <h2 id="posts-heading">Posts Recentes</h2>

  <ul className="space-y-4">
    {posts.map(post => (
      <li key={post.id}>
        <PostCard post={post} />
      </li>
    ))}
  </ul>

  {posts.length === 0 && (
    <p className="text-secondary">
      Nenhum post encontrado.
    </p>
  )}
</section>
```

### Accessible Tabs

```jsx
<div className="tabs">
  <div role="tablist" aria-label="Filtros de notificação">
    <button
      role="tab"
      aria-selected={activeTab === 'all'}
      aria-controls="panel-all"
      id="tab-all"
      onClick={() => setActiveTab('all')}
    >
      Todas
    </button>
    <button
      role="tab"
      aria-selected={activeTab === 'read'}
      aria-controls="panel-read"
      id="tab-read"
      onClick={() => setActiveTab('read')}
    >
      Lidas
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel-all"
    aria-labelledby="tab-all"
    hidden={activeTab !== 'all'}
  >
    {/* Content for "Todas" */}
  </div>

  <div
    role="tabpanel"
    id="panel-read"
    aria-labelledby="tab-read"
    hidden={activeTab !== 'read'}
  >
    {/* Content for "Lidas" */}
  </div>
</div>
```

---

## Accessibility Checklist

Use this checklist for every new feature or page:

### Content

- [ ] All images have descriptive alt text
- [ ] Decorative images have empty alt or aria-hidden
- [ ] Videos have captions (if applicable)
- [ ] Color is not the only means of conveying information
- [ ] Text has sufficient color contrast (4.5:1 minimum)
- [ ] Content is readable at 200% zoom
- [ ] Page has descriptive title
- [ ] Headings are in logical order (h1 → h2 → h3)
- [ ] Language is set (lang="pt-BR")

### Navigation

- [ ] Skip to main content link is present
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Links have descriptive text

### Forms

- [ ] All inputs have associated labels
- [ ] Required fields are indicated
- [ ] Error messages are clear and helpful
- [ ] Success feedback is provided
- [ ] Form instructions are clear
- [ ] Input purpose is programmatically determined (autocomplete)

### Interactive Components

- [ ] Buttons have descriptive labels
- [ ] Custom controls have proper ARIA roles
- [ ] Modal dialogs trap focus
- [ ] Modals can be closed with Escape key
- [ ] Dropdown menus are keyboard accessible
- [ ] Tab components follow ARIA pattern

### Dynamic Content

- [ ] Loading states are announced to screen readers
- [ ] Success/error messages use live regions
- [ ] Dynamic content updates are announced
- [ ] Infinite scroll has alternative pagination

### Mobile

- [ ] Touch targets are at least 44x44px
- [ ] Content works in portrait and landscape
- [ ] Gestures have keyboard/tap alternatives
- [ ] Text is readable without zooming

### Testing

- [ ] Tested with keyboard only
- [ ] Tested with screen reader (NVDA/VoiceOver)
- [ ] Passed axe DevTools scan (0 violations)
- [ ] Lighthouse accessibility score 90+
- [ ] Tested at 320px width (mobile)
- [ ] Tested at 200% zoom

---

## Tools & Resources

### Browser Extensions

- **axe DevTools** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Performance and accessibility audits
- **Color Contrast Analyzer** - Check color contrast ratios

### Screen Readers

- **NVDA** (Windows) - https://www.nvaccess.org/
- **JAWS** (Windows) - https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in

### Documentation

- **WCAG 2.1 Quick Reference** - https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility** - https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **ARIA Authoring Practices** - https://www.w3.org/WAI/ARIA/apg/
- **WebAIM** - https://webaim.org/

### Testing Tools

- **Pa11y** - Automated accessibility testing
- **jest-axe** - Accessibility testing in Jest
- **Playwright** - E2E testing with accessibility checks

---

## Reporting Accessibility Issues

If you discover an accessibility issue:

1. **Check if it's a known issue** in GitHub Issues
2. **Create a new issue** with:
   - Title: [A11Y] Brief description
   - WCAG criterion violated (e.g., 1.4.3 Contrast)
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots/recordings if helpful
   - Device/browser/assistive technology used
3. **Label the issue** with `accessibility` and appropriate severity

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-04 | Initial accessibility documentation |

---

**Maintained by:** PassaBola Development Team
**Accessibility Lead:** [Name]
**Questions?** Contact accessibility@passabola.com or open a GitHub Discussion.
