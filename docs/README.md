# PassaBola Documentation

**Welcome to the PassaBola Documentation Hub!**

This directory contains comprehensive documentation for developers, designers, and contributors working on the PassaBola project - the social network for women's football in Brazil.

## Documentation Index

### Core Documentation

| Document | Description | For Who |
|----------|-------------|---------|
| [Design System](./DESIGN-SYSTEM.md) | Color palette, typography, spacing, and design tokens | Designers, Frontend Developers |
| [Component Library](./COMPONENT-LIBRARY.md) | Reusable React components with usage examples | Frontend Developers |
| [Accessibility](./ACCESSIBILITY.md) | WCAG 2.1 AA compliance guidelines and testing | All Developers, QA |
| [Testing Guide](./TESTING-GUIDE.md) | Testing strategy, tools, and best practices | Developers, QA Engineers |

### Sprint Documentation

| Sprint | Status | Description |
|--------|--------|-------------|
| [SPRINT-001: UX Improvements](./sprints/SPRINT-001-UX-IMPROVEMENTS.md) | 📋 Planned | UX enhancement across 7 areas with production readiness focus |

### Project Documentation (Root Level)

Located in the root directory and `.github` folder:

| Document | Location | Description |
|----------|----------|-------------|
| README.md | `/README.md` | Project overview, setup instructions, architecture |
| API Documentation | `/.github/api-readme.md` | Backend API endpoints and usage |

---

## Quick Start Guide

### For New Developers

1. **Start Here:** Read the main [README.md](/README.md) for project overview and setup
2. **Understand the Design:** Review [Design System](./DESIGN-SYSTEM.md) for UI/UX guidelines
3. **Explore Components:** Check [Component Library](./COMPONENT-LIBRARY.md) before creating new components
4. **Learn Testing:** Read [Testing Guide](./TESTING-GUIDE.md) to write tests
5. **Accessibility:** Familiarize yourself with [Accessibility](./ACCESSIBILITY.md) standards

### For Designers

1. **Design System:** [Design System](./DESIGN-SYSTEM.md) - All colors, spacing, typography
2. **Components:** [Component Library](./COMPONENT-LIBRARY.md) - Existing UI components
3. **Accessibility:** [Accessibility](./ACCESSIBILITY.md) - Color contrast, touch targets, etc.

### For QA Engineers

1. **Testing Strategy:** [Testing Guide](./TESTING-GUIDE.md) - Unit, integration, E2E testing
2. **Accessibility Testing:** [Accessibility](./ACCESSIBILITY.md) - WCAG compliance checklist
3. **Sprint Plans:** Check `./sprints/` for current sprint requirements

---

## Documentation Structure

```
docs/
├── README.md                    # This file - documentation index
├── DESIGN-SYSTEM.md             # Design tokens, colors, typography
├── COMPONENT-LIBRARY.md         # Component documentation and examples
├── ACCESSIBILITY.md             # WCAG 2.1 AA compliance guidelines
├── TESTING-GUIDE.md             # Testing strategy and best practices
└── sprints/
    └── SPRINT-001-UX-IMPROVEMENTS.md  # Sprint planning documentation
```

---

## Documentation Standards

### Writing Documentation

When contributing to documentation:

1. **Use Clear Language**
   - Write in Brazilian Portuguese for user-facing content
   - Use English for technical documentation
   - Avoid jargon unless necessary (define when used)
   - Use active voice

2. **Include Examples**
   - Provide code examples for every component/feature
   - Show both basic and advanced usage
   - Include common pitfalls and solutions

3. **Keep It Updated**
   - Update docs when code changes
   - Mark deprecated features clearly
   - Include version and last updated date

4. **Follow Markdown Standards**
   - Use proper heading hierarchy (h1 → h2 → h3)
   - Include table of contents for long documents
   - Use code blocks with language specification
   - Add alt text to images

### Documentation Template

```markdown
# Document Title

**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** Active/Draft/Deprecated

## Overview

Brief description of what this document covers.

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1

Content...

### Subsection 1.1

Content with examples:

\`\`\`javascript
// Code example
const example = "Hello World";
\`\`\`

## Resources

- [Related Doc](./link.md)
- [External Resource](https://example.com)

---

**Maintained by:** Team/Person Name
**Questions?** Contact info or discussion link
```

---

## How to Navigate This Documentation

### By Role

**Frontend Developer:**
1. Design System → Component Library → Testing Guide → Accessibility

**Backend Developer:**
1. README.md → API Documentation (`.github/api-readme.md`)

**Designer:**
1. Design System → Component Library → Accessibility

**QA Engineer:**
1. Testing Guide → Accessibility → Sprint Documentation

**Product Owner/Scrum Master:**
1. README.md → Sprint Documentation

### By Task

**Creating a New Component:**
1. Check [Component Library](./COMPONENT-LIBRARY.md) to avoid duplication
2. Follow patterns in [Design System](./DESIGN-SYSTEM.md)
3. Ensure [Accessibility](./ACCESSIBILITY.md) compliance
4. Write tests per [Testing Guide](./TESTING-GUIDE.md)

**Implementing a Feature:**
1. Review sprint documentation in `./sprints/`
2. Follow [Design System](./DESIGN-SYSTEM.md) guidelines
3. Use existing [Component Library](./COMPONENT-LIBRARY.md) components
4. Write tests per [Testing Guide](./TESTING-GUIDE.md)
5. Verify [Accessibility](./ACCESSIBILITY.md) checklist

**Fixing a Bug:**
1. Write a failing test first ([Testing Guide](./TESTING-GUIDE.md))
2. Fix the bug
3. Ensure test passes
4. Verify no accessibility regressions ([Accessibility](./ACCESSIBILITY.md))

---

## Contributing to Documentation

### Making Changes

1. **Small Updates**
   - Fix typos, broken links, outdated info
   - Submit PR with changes

2. **New Documentation**
   - Discuss in GitHub Discussion first
   - Follow documentation template
   - Submit PR with new doc + update to this index

3. **Major Refactors**
   - Open GitHub Issue for discussion
   - Get approval before starting
   - Update all cross-references

### Documentation Review Process

All documentation changes go through the same PR review process as code:

1. Create branch: `docs/description-of-change`
2. Make changes
3. Submit PR with clear description
4. Request review from technical writer or team lead
5. Address feedback
6. Merge to main

---

## Documentation Roadmap

### Current Status

- ✅ Design System documented
- ✅ Component Library documented
- ✅ Accessibility guidelines documented
- ✅ Testing guide created
- ✅ Sprint 001 planned
- 🔄 API documentation (existing, needs review)

### Upcoming Documentation

- [ ] **Architecture Decision Records (ADRs)** - Document major technical decisions
- [ ] **Deployment Guide** - How to deploy to production
- [ ] **Contribution Guide** - How to contribute to the project
- [ ] **Internationalization (i18n)** - Multi-language support guide
- [ ] **Performance Optimization** - Best practices for optimization
- [ ] **Security Guidelines** - Security best practices
- [ ] **Troubleshooting** - Common issues and solutions

### Feedback Welcome

Have suggestions for improving our documentation?
- Open a [GitHub Discussion](https://github.com/your-org/passabola/discussions)
- Submit a PR with improvements
- Contact the documentation lead

---

## External Resources

### Next.js & React

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Next.js Learn Course](https://nextjs.org/learn)

### Styling

- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [CSS-Tricks](https://css-tricks.com/)

### Accessibility

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

### Testing

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Design

- [Material Design](https://material.io/design)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Refactoring UI](https://www.refactoringui.com/)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-04 | Initial documentation hub created | PassaBola Team |

---

## Support & Contact

### Get Help

- **Technical Questions:** Open a [GitHub Discussion](https://github.com/your-org/passabola/discussions)
- **Bug Reports:** [Create an Issue](https://github.com/your-org/passabola/issues/new)
- **Feature Requests:** [GitHub Discussions](https://github.com/your-org/passabola/discussions)

### Team Contacts

- **Tech Lead:** [Name] - technical@passabola.com
- **Frontend Lead:** [Name] - frontend@passabola.com
- **Documentation Lead:** [Name] - docs@passabola.com
- **Accessibility Lead:** [Name] - accessibility@passabola.com

---

<p align="center">
  <strong>Made with ❤️ by the PassaBola Team</strong><br>
  Empowering women's football through technology
</p>
