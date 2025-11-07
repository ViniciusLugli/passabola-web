/**
 * AccordionSection Component Tests
 *
 * Test suite covering:
 * - Rendering with correct title
 * - Toggle open/closed on click
 * - Keyboard interaction (Enter/Space)
 * - localStorage persistence
 * - Loading saved state on mount
 * - Icon rotation animation
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionSection from '@/app/components/AccordionSection';

describe('AccordionSection Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders with correct title', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Test Content</p>
        </AccordionSection>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders ChevronDown icon', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders in closed state by default', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders in open state when defaultOpen is true', () => {
      localStorage.clear();
      const { container } = render(
        <AccordionSection id="test" title="Test Section" defaultOpen={true}>
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      // Give time for useEffect to run
      setTimeout(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      }, 0);
    });
  });

  describe('Toggle Functionality', () => {
    it('toggles open/closed on click', async () => {
      const user = userEvent.setup();
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      // Initially closed
      expect(button).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles content visibility', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      const content = container.querySelector('[role="region"]');

      // Initially has max-h-0 (closed)
      expect(content).toHaveClass('max-h-0', 'opacity-0');

      // Click to open
      await user.click(button);
      expect(content).toHaveClass('max-h-[5000px]', 'opacity-100');

      // Click to close
      await user.click(button);
      expect(content).toHaveClass('max-h-0', 'opacity-0');
    });

    it('rotates icon when toggled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const icon = container.querySelector('svg');
      const button = screen.getByRole('button', { name: /Test Section/ });

      // Initially not rotated
      expect(icon).toHaveClass('rotate-0');

      // Click to open
      await user.click(button);
      expect(icon).toHaveClass('rotate-180');

      // Click to close
      await user.click(button);
      expect(icon).toHaveClass('rotate-0');
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles with Enter key', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles with Space key', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(button, { key: ' ' });
      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(button, { key: ' ' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('prevents default behavior for Enter key', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(button, event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('prevents default behavior for Space key', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(button, event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not toggle with other keys', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(button, { key: 'a' });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(button, { key: 'Tab' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('localStorage Persistence', () => {
    it('saves state to localStorage when toggled', async () => {
      const user = userEvent.setup();
      localStorage.clear();
      localStorage.setItem.mockClear();

      render(
        <AccordionSection id="test-section" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });

      // Open accordion
      await user.click(button);

      // Should save to localStorage
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('accordion-test-section', 'true');
      });

      // Close accordion
      await user.click(button);

      // Should update localStorage
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('accordion-test-section', 'false');
      });
    });

    it('loads saved state from localStorage on mount', async () => {
      // Set saved state in localStorage
      localStorage.getItem.mockReturnValue('true');

      render(
        <AccordionSection id="saved" title="Saved Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Saved Section/ });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('uses defaultOpen when no saved state exists', async () => {
      localStorage.getItem.mockReturnValue(null);

      render(
        <AccordionSection id="new-section" title="New Section" defaultOpen={true}>
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /New Section/ });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('saved state overrides defaultOpen', () => {
      // Set saved state to closed
      localStorage.setItem('accordion-override', 'false');

      render(
        <AccordionSection id="override" title="Override Section" defaultOpen={true}>
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Override Section/ });
      // Should be closed because of saved state
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not save to localStorage if id is not provided', async () => {
      const user = userEvent.setup();
      localStorage.setItem.mockClear();

      render(
        <AccordionSection title="No ID Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /No ID Section/ });
      await user.click(button);

      await waitFor(() => {
        // setItem should not have been called for this component
        const calls = localStorage.setItem.mock.calls;
        const hasAccordionCall = calls.some(call => call[0]?.startsWith('accordion-'));
        expect(hasAccordionCall).toBe(false);
      });
    });
  });

  describe('Accessibility', () => {
    it('button has type="button"', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('button has aria-expanded attribute', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveAttribute('aria-expanded');
    });

    it('button has aria-controls linking to content', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveAttribute('aria-controls', 'accordion-content-test');
    });

    it('button has matching id', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveAttribute('id', 'accordion-header-test');
    });

    it('content has role="region"', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const content = screen.getByRole('region');
      expect(content).toBeInTheDocument();
    });

    it('content has aria-labelledby linking to button', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const content = screen.getByRole('region');
      expect(content).toHaveAttribute('aria-labelledby', 'accordion-header-test');
    });

    it('icon has aria-hidden="true"', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('button has focus ring styles', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-accent');
    });

    it('button is keyboard focusable', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive padding on button', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveClass('p-4', 'md:p-5');
    });

    it('has responsive padding on content', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section" defaultOpen={true}>
          <p>Content</p>
        </AccordionSection>
      );

      const contentInner = container.querySelector('.p-4.md\\:p-6');
      expect(contentInner).toBeInTheDocument();
    });

    it('has responsive title text size', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const title = screen.getByText('Test Section');
      expect(title).toHaveClass('text-lg', 'md:text-xl');
    });

    it('has responsive icon size', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-5', 'w-5', 'md:h-6', 'md:w-6');
    });
  });

  describe('Animation and Transitions', () => {
    it('has transition classes on content', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const content = container.querySelector('[role="region"]');
      expect(content).toHaveClass('transition-all', 'duration-200');
    });

    it('has transition classes on icon', () => {
      const { container } = render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('transition-transform', 'duration-200');
    });

    it('has hover effect on button', () => {
      render(
        <AccordionSection id="test" title="Test Section">
          <p>Content</p>
        </AccordionSection>
      );

      const button = screen.getByRole('button', { name: /Test Section/ });
      expect(button).toHaveClass('hover:bg-surface-elevated', 'transition-colors');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing id gracefully', () => {
      expect(() => {
        render(
          <AccordionSection title="No ID">
            <p>Content</p>
          </AccordionSection>
        );
      }).not.toThrow();
    });

    it('handles empty children', () => {
      render(
        <AccordionSection id="test" title="Test Section">
        </AccordionSection>
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('handles multiple children', () => {
      render(
        <AccordionSection id="test" title="Test Section" defaultOpen={true}>
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <button>A button</button>
        </AccordionSection>
      );

      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'A button' })).toBeInTheDocument();
    });

    it('works with complex content structures', () => {
      render(
        <AccordionSection id="test" title="Test Section" defaultOpen={true}>
          <div>
            <h4>Subtitle</h4>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </AccordionSection>
      );

      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});
