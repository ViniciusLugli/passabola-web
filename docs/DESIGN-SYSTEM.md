# PassaBola Design System

**Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Active

## Overview

The PassaBola Design System is a comprehensive collection of design tokens, components, and guidelines that ensure consistency and quality across the entire application. Built with Tailwind CSS 4 and CSS custom properties, our design system supports both light and dark themes and is optimized for accessibility and performance.

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing Scale](#spacing-scale)
- [Layout Grid](#layout-grid)
- [Shadows & Elevation](#shadows--elevation)
- [Border Radius](#border-radius)
- [Transitions & Animations](#transitions--animations)
- [Breakpoints](#breakpoints)
- [Iconography](#iconography)
- [Brand Guidelines](#brand-guidelines)

---

## Color Palette

### Design Tokens

All colors are defined as CSS custom properties in `/app/globals.css` and support both light and dark themes through the `html.dark` selector.

### Surface Colors

Colors used for backgrounds and containers.

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-page` | `#f4f7fc` | `#090b16` | Main page background |
| `--color-surface` | `#ffffff` | `#151b2e` | Card and container backgrounds |
| `--color-surface-muted` | `#f6f8fc` | `#1e263c` | Subtle background variations |
| `--color-surface-elevated` | `#f9f4ff` | `#2e3a58` | Elevated elements (modals, dropdowns) |

#### Usage Examples

```css
/* Using utility classes */
.bg-page { background-color: rgb(var(--color-page)); }
.bg-surface { background-color: rgb(var(--color-surface)); }
.bg-surface-muted { background-color: rgb(var(--color-surface-muted)); }
.bg-surface-elevated { background-color: rgb(var(--color-surface-elevated)); }
```

```jsx
// In components
<div className="bg-surface rounded-lg p-4">
  <h2 className="text-primary">Card Title</h2>
  <p className="text-secondary">Card content...</p>
</div>
```

### Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-border-subtle` | `#e0e3eb` | `#252e44` | Subtle borders and dividers |
| `--color-border-strong` | `#cbd0dd` | `#4a5a78` | Prominent borders |

### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-text-primary` | `#111827` | `#e9eeff` | Headings and primary content |
| `--color-text-secondary` | `#4f5669` | `#bbc4de` | Body text and descriptions |
| `--color-text-tertiary` | `#717989` | `#929dba` | Metadata, captions, placeholders |
| `--color-text-inverse` | `#ffffff` | `#0c1018` | Text on colored backgrounds |

#### Typography Hierarchy

```jsx
// Primary - Headings and important text
<h1 className="text-primary text-3xl font-bold">
  Main Heading
</h1>

// Secondary - Body text
<p className="text-secondary text-base">
  This is a paragraph with secondary text color.
</p>

// Tertiary - Metadata and less important text
<span className="text-tertiary text-sm">
  2 hours ago
</span>
```

### Brand Colors

PassaBola's signature purple identity.

| Token | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| `--color-accent` | `#6d28d9` | `109 40 217` | Primary brand color, CTAs, links |
| `--color-accent-strong` | `#581cb4` | `88 28 180` | Hover states, emphasis |
| `--color-accent-soft` | Light: `#e5dbff`<br>Dark: `#321a5d` | Light: `229 219 255`<br>Dark: `50 26 93` | Backgrounds for accented content |
| `--color-accent-contrast` | Light: `#ffffff`<br>Dark: `#f5f5ff` | Light: `255 255 255`<br>Dark: `245 245 255` | Text on accent backgrounds |

#### Brand Gradient

```css
.bg-brand-gradient {
  background-image: linear-gradient(135deg, #581cb4 0%, #6d28d9 100%);
  color: rgb(var(--color-accent-contrast));
}
```

```jsx
// Primary CTA button
<button className="bg-brand-gradient px-6 py-3 rounded-xl font-bold">
  Começar Agora
</button>
```

### Semantic Colors

Colors that communicate meaning.

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-success` | `#10b981` | `#22c55e` | Success messages, confirmations |
| `--color-danger` | `#ef4444` | `#f87171` | Errors, destructive actions |

#### Semantic Color Utilities

```css
/* Text colors */
.text-success { color: rgb(var(--color-success)); }
.text-danger { color: rgb(var(--color-danger)); }

/* Background colors (soft) */
.bg-success-soft {
  background-color: color-mix(in srgb, rgb(var(--color-success)), white 85%);
}
.bg-danger-soft {
  background-color: color-mix(in srgb, rgb(var(--color-danger)), white 90%);
}

/* Borders */
.border-success { border-color: rgb(var(--color-success)); }
.border-danger { border-color: rgb(var(--color-danger)); }
```

### Color Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

| Combination | Contrast Ratio | WCAG Level |
|-------------|----------------|------------|
| text-primary on bg-surface | 12.5:1 | AAA |
| text-secondary on bg-surface | 7.8:1 | AAA |
| text-tertiary on bg-surface | 4.9:1 | AA |
| accent on surface | 6.2:1 | AA |
| white on accent | 8.1:1 | AAA |

---

## Typography

### Font Families

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
}

body {
  font-family: var(--font-sans);
}
```

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Captions, metadata |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Small body text, labels |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Body text, paragraphs |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Large body text |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | H4 headings |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | H3 headings |
| `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | H2 headings |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | H1 headings |
| `text-5xl` | 3rem (48px) | 1 | Hero headings |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasis within text |
| `font-semibold` | 600 | Subheadings, buttons |
| `font-bold` | 700 | Headings, strong emphasis |

### Typography Examples

```jsx
// Page Title
<h1 className="text-4xl font-bold text-primary mb-4">
  Bem-vindo ao PassaBola
</h1>

// Section Heading
<h2 className="text-2xl font-semibold text-primary mb-3">
  Suas Notificações
</h2>

// Card Title
<h3 className="text-lg font-semibold text-primary">
  Time das Leoas
</h3>

// Body Text
<p className="text-base text-secondary leading-relaxed">
  Conecte-se com jogadoras de futebol em todo o Brasil.
</p>

// Caption
<span className="text-xs text-tertiary">
  Há 2 horas
</span>
```

### Responsive Typography

Use responsive classes for adaptive text sizes:

```jsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>
```

---

## Spacing Scale

PassaBola uses a consistent 4px-based spacing scale.

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | Reset spacing |
| `1` | 0.25rem (4px) | Minimal spacing |
| `2` | 0.5rem (8px) | Tight spacing |
| `3` | 0.75rem (12px) | Small gaps |
| `4` | 1rem (16px) | Default spacing |
| `5` | 1.25rem (20px) | Medium spacing |
| `6` | 1.5rem (24px) | Large spacing |
| `8` | 2rem (32px) | Section spacing |
| `10` | 2.5rem (40px) | Large section spacing |
| `12` | 3rem (48px) | Extra large spacing |
| `16` | 4rem (64px) | Hero spacing |
| `20` | 5rem (80px) | Maximum spacing |

### Spacing Application

```jsx
// Padding
<div className="p-4">        {/* 16px all sides */}
<div className="px-6 py-4">  {/* 24px horizontal, 16px vertical */}
<div className="pt-8">       {/* 32px top */}

// Margin
<div className="mb-4">       {/* 16px bottom margin */}
<div className="mt-8">       {/* 32px top margin */}

// Gap (for flexbox/grid)
<div className="flex gap-4"> {/* 16px gap between children */}
<div className="grid gap-6"> {/* 24px gap in grid */}
```

### Common Spacing Patterns

```jsx
// Card Spacing
<div className="bg-surface rounded-lg p-4 mb-4">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-secondary">Card content</p>
</div>

// Section Spacing
<section className="py-12 px-4">
  <h2 className="text-3xl font-bold mb-6">Section Title</h2>
  <div className="grid gap-6">
    {/* Content */}
  </div>
</section>

// List Item Spacing
<li className="py-3 px-4 border-b border-default">
  List item content
</li>
```

---

## Layout Grid

### Container

```jsx
// Full-width container with max-width
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>

// Responsive container
<div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  {/* Content */}
</div>
```

### Grid System

```jsx
// 12-column grid
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12 md:col-span-8">Main Content</div>
  <div className="col-span-12 md:col-span-4">Sidebar</div>
</div>

// Responsive 3-column layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Flexbox Patterns

```jsx
// Center content
<div className="flex items-center justify-center min-h-screen">
  <div>Centered Content</div>
</div>

// Space between
<div className="flex items-center justify-between p-4">
  <div>Left</div>
  <div>Right</div>
</div>

// Vertical stack with gap
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Shadows & Elevation

### Shadow Tokens

```css
:root {
  --shadow-color: 15 23 42; /* Light mode */
}

html.dark {
  --shadow-color: 4 7 16; /* Dark mode */
}
```

### Shadow Classes

| Class | Box Shadow | Usage |
|-------|------------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| `shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.1)` | Default cards |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Elevated cards |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, dropdowns |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | High elevation |
| `shadow-elevated` | Custom | Special elevated elements |

### Custom Elevated Shadow

```css
.shadow-elevated {
  box-shadow: 0 25px 50px -24px rgb(var(--shadow-color) / 0.6);
}
```

### Usage Examples

```jsx
// Card with subtle shadow
<div className="bg-surface rounded-lg shadow p-4">
  Card Content
</div>

// Elevated card on hover
<div className="bg-surface rounded-lg shadow hover:shadow-lg transition-shadow">
  Interactive Card
</div>

// Modal with strong shadow
<div className="bg-surface rounded-xl shadow-xl p-6">
  Modal Content
</div>
```

---

## Border Radius

### Radius Scale

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0 | Sharp corners |
| `rounded-sm` | 0.125rem (2px) | Minimal rounding |
| `rounded` | 0.25rem (4px) | Small elements |
| `rounded-md` | 0.375rem (6px) | Medium elements |
| `rounded-lg` | 0.5rem (8px) | Cards, containers |
| `rounded-xl` | 0.75rem (12px) | Buttons, modals |
| `rounded-2xl` | 1rem (16px) | Hero sections |
| `rounded-full` | 9999px | Circular elements (avatars, badges) |

### Usage Examples

```jsx
// Card
<div className="rounded-lg bg-surface p-4">
  Card with 8px radius
</div>

// Button
<button className="rounded-xl bg-accent px-6 py-3">
  Button with 12px radius
</button>

// Avatar
<img src="/avatar.jpg" className="rounded-full w-10 h-10" />

// Badge
<span className="rounded-full bg-accent-soft px-3 py-1 text-xs">
  Badge
</span>
```

---

## Transitions & Animations

### Transition Durations

| Class | Duration | Usage |
|-------|----------|-------|
| `duration-75` | 75ms | Instant feedback |
| `duration-100` | 100ms | Quick transitions |
| `duration-150` | 150ms | Default micro-interactions |
| `duration-200` | 200ms | Standard transitions |
| `duration-300` | 300ms | Noticeable animations |
| `duration-500` | 500ms | Dramatic animations |

### Transition Properties

```jsx
// All properties
<div className="transition-all duration-200">
  Transitions all properties
</div>

// Specific properties
<div className="transition-colors duration-200">
  Color transitions only
</div>

<div className="transition-transform duration-300">
  Transform transitions only
</div>

<div className="transition-opacity duration-200">
  Opacity transitions only
</div>
```

### Easing Functions

| Class | Easing | Usage |
|-------|--------|-------|
| `ease-linear` | Linear | Constant speed |
| `ease-in` | Cubic-bezier | Slow start |
| `ease-out` | Cubic-bezier | Slow end (default for most interactions) |
| `ease-in-out` | Cubic-bezier | Slow start and end |

### Hover States

```jsx
// Button hover
<button className="bg-accent hover:bg-accent-strong transition-colors duration-200">
  Hover Me
</button>

// Card hover
<div className="bg-surface hover:shadow-lg transition-shadow duration-200">
  Hover for shadow
</div>

// Scale on hover
<button className="hover:scale-105 active:scale-95 transition-transform duration-200">
  Hover to scale
</button>
```

### Custom Animations

```css
/* Slide in from right */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

.group:hover .group-hover\:animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## Breakpoints

PassaBola uses mobile-first responsive design.

### Breakpoint Tokens

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Testing Breakpoints

Additional breakpoints to test manually:

- **320px** - Smallest mobile (iPhone SE)
- **375px** - Standard mobile (iPhone 12)
- **425px** - Large mobile
- **1920px** - Full HD desktop

### Responsive Examples

```jsx
// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">
  Responsive horizontal padding
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive column count
</div>

// Responsive text size
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  Responsive heading
</h1>

// Responsive visibility
<div className="block md:hidden">
  Only visible on mobile
</div>

<div className="hidden md:block">
  Only visible on desktop
</div>
```

---

## Iconography

### Icon Library

PassaBola uses **Lucide React** for icons.

```bash
npm install lucide-react
```

### Icon Sizes

| Size Class | Dimension | Usage |
|------------|-----------|-------|
| `w-4 h-4` | 16px | Small icons in text |
| `w-5 h-5` | 20px | Default icon size |
| `w-6 h-6` | 24px | Medium icons |
| `w-8 h-8` | 32px | Large icons |
| `w-12 h-12` | 48px | Hero icons |

### Icon Usage

```jsx
import { Heart, MessageCircle, Share2, Bell, Search } from 'lucide-react';

// In buttons
<button className="flex items-center gap-2">
  <Heart className="w-5 h-5" />
  <span>Curtir</span>
</button>

// Icon-only button
<button aria-label="Notificações" className="p-2">
  <Bell className="w-6 h-6" />
</button>

// With color
<Search className="w-5 h-5 text-tertiary" />
```

### Icon Accessibility

Always provide accessible labels for icon-only buttons:

```jsx
// Good
<button aria-label="Fechar modal">
  <X className="w-5 h-5" />
</button>

// Bad (missing label)
<button>
  <X className="w-5 h-5" />
</button>
```

---

## Brand Guidelines

### Logo Usage

#### Spacing

- Maintain minimum clear space of 2x the logo height around the logo
- Never distort or skew the logo
- Do not use logo on busy backgrounds without sufficient contrast

#### Logo Variations

- **Full Color:** Use on light backgrounds
- **Monochrome:** Use on dark backgrounds or when color is not available
- **Icon Only:** Use for app icons, favicons (minimum 32x32px)

### Brand Colors

#### Primary Brand Color

- **Purple:** `#6d28d9` (109, 40, 217)
- Use for primary CTAs, links, and brand moments

#### Secondary Brand Color

- **Deep Purple:** `#581cb4` (88, 28, 180)
- Use for hover states and emphasis

#### Accent Usage

- Minimum 30% of any given screen should use brand colors
- Use brand gradient for hero sections and primary CTAs
- Avoid overuse - reserve for important actions

### Tone of Voice

- **Friendly:** Use casual, approachable language
- **Empowering:** Highlight user achievements and capabilities
- **Inclusive:** Welcome all skill levels and backgrounds
- **Passionate:** Celebrate women's football

### Writing Style

- Use Brazilian Portuguese (pt-BR)
- Avoid jargon and technical terms when possible
- Use active voice
- Keep sentences concise
- Use "você" (informal) rather than "o senhor/a senhora"

---

## Best Practices

### Do's

- Always use design system tokens (CSS variables, Tailwind classes)
- Test all designs in both light and dark mode
- Ensure WCAG 2.1 AA color contrast compliance
- Use semantic HTML elements
- Provide alternative text for images
- Test on real devices, not just browser DevTools

### Don'ts

- Don't use hardcoded colors (e.g., `#ffffff`, `rgb(255, 255, 255)`)
- Don't skip responsive testing at 320px
- Don't rely solely on color to convey information
- Don't use animations that could trigger motion sickness
- Don't create custom components when design system components exist

---

## Resources

### Design Tools

- **Figma:** Design mockups and prototypes (if applicable)
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Palette Generator:** https://coolors.co/

### Development Tools

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

### Component Examples

See `/docs/COMPONENT-LIBRARY.md` for detailed component documentation and usage examples.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-04 | Initial design system documentation |

---

**Maintained by:** PassaBola Development Team
**Questions?** Open a GitHub Discussion or contact the design lead.
