/**
 * ProfileTabs Component Tests
 *
 * Test suite covering:
 * - Tab rendering and count badges
 * - Active tab styling
 * - Tab click interactions
 * - Keyboard navigation (ArrowLeft, ArrowRight, Home, End)
 * - Accessibility (ARIA labels and roles)
 * - Responsive behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileTabs from '@/app/components/ProfileTabs';

describe('ProfileTabs Component', () => {
  const mockOnTabChange = vi.fn();

  const defaultCounts = {
    ranking: 10,
    posts: 25,
    teams: 3,
    games: 15,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all 4 tabs', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      expect(screen.getByText('Ranking')).toBeInTheDocument();
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('Times')).toBeInTheDocument();
      expect(screen.getByText('Jogos')).toBeInTheDocument();
    });

    it('displays correct count badges for each tab', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('displays 0 count when count is undefined', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={{}}
        />
      );

      const countBadges = screen.getAllByText('0');
      expect(countBadges).toHaveLength(4);
    });

    it('displays 0 count when counts prop is not provided', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
        />
      );

      const countBadges = screen.getAllByText('0');
      expect(countBadges).toHaveLength(4);
    });
  });

  describe('Active Tab Styling', () => {
    it('applies active styling to the current tab', () => {
      render(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const postsTab = screen.getByRole('tab', { name: /Posts/ });
      expect(postsTab).toHaveClass('border-accent', 'text-accent');
    });

    it('applies inactive styling to non-active tabs', () => {
      render(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      expect(rankingTab).toHaveClass('border-transparent', 'text-secondary');
    });

    it('updates active tab styling when activeTab prop changes', () => {
      const { rerender } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      let rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      expect(rankingTab).toHaveClass('border-accent');

      rerender(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      const postsTab = screen.getByRole('tab', { name: /Posts/ });

      expect(rankingTab).toHaveClass('border-transparent');
      expect(postsTab).toHaveClass('border-accent');
    });
  });

  describe('Tab Click Interactions', () => {
    it('calls onTabChange when a tab is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const postsTab = screen.getByRole('tab', { name: /Posts/ });
      await user.click(postsTab);

      expect(mockOnTabChange).toHaveBeenCalledTimes(1);
      expect(mockOnTabChange).toHaveBeenCalledWith('posts');
    });

    it('calls onTabChange with correct tab id for each tab', async () => {
      const user = userEvent.setup();
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      await user.click(screen.getByRole('tab', { name: /Posts/ }));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('posts');

      await user.click(screen.getByRole('tab', { name: /Times/ }));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('teams');

      await user.click(screen.getByRole('tab', { name: /Jogos/ }));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('games');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates to next tab with ArrowRight', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      rankingTab.focus();

      fireEvent.keyDown(rankingTab, { key: 'ArrowRight' });

      expect(mockOnTabChange).toHaveBeenCalledWith('posts');
    });

    it('navigates to previous tab with ArrowLeft', () => {
      render(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const postsTab = screen.getByRole('tab', { name: /Posts/ });
      postsTab.focus();

      fireEvent.keyDown(postsTab, { key: 'ArrowLeft' });

      expect(mockOnTabChange).toHaveBeenCalledWith('ranking');
    });

    it('wraps to first tab when pressing ArrowRight on last tab', () => {
      render(
        <ProfileTabs
          activeTab="games"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const gamesTab = screen.getByRole('tab', { name: /Jogos/ });
      gamesTab.focus();

      fireEvent.keyDown(gamesTab, { key: 'ArrowRight' });

      expect(mockOnTabChange).toHaveBeenCalledWith('ranking');
    });

    it('wraps to last tab when pressing ArrowLeft on first tab', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      rankingTab.focus();

      fireEvent.keyDown(rankingTab, { key: 'ArrowLeft' });

      expect(mockOnTabChange).toHaveBeenCalledWith('games');
    });

    it('navigates to first tab with Home key', () => {
      render(
        <ProfileTabs
          activeTab="games"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const gamesTab = screen.getByRole('tab', { name: /Jogos/ });
      gamesTab.focus();

      fireEvent.keyDown(gamesTab, { key: 'Home' });

      expect(mockOnTabChange).toHaveBeenCalledWith('ranking');
    });

    it('navigates to last tab with End key', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      rankingTab.focus();

      fireEvent.keyDown(rankingTab, { key: 'End' });

      expect(mockOnTabChange).toHaveBeenCalledWith('games');
    });

    it('does not navigate with other keys', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      rankingTab.focus();

      fireEvent.keyDown(rankingTab, { key: 'Space' });
      fireEvent.keyDown(rankingTab, { key: 'Enter' });
      fireEvent.keyDown(rankingTab, { key: 'a' });

      expect(mockOnTabChange).not.toHaveBeenCalled();
    });

    it('focuses the newly activated tab after keyboard navigation', async () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      rankingTab.focus();

      fireEvent.keyDown(rankingTab, { key: 'ArrowRight' });

      // Wait for focus to be set
      await waitFor(() => {
        const postsTab = screen.getByRole('tab', { name: /Posts/ });
        expect(postsTab).toHaveFocus();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role on tabs container', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
    });

    it('has proper ARIA label on tablist', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tablist = screen.getByRole('tablist', { name: 'Seções do perfil' });
      expect(tablist).toBeInTheDocument();
    });

    it('sets aria-selected correctly on tabs', () => {
      render(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const postsTab = screen.getByRole('tab', { name: /Posts/ });
      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });

      expect(postsTab).toHaveAttribute('aria-selected', 'true');
      expect(rankingTab).toHaveAttribute('aria-selected', 'false');
    });

    it('sets aria-controls with correct panel id', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      expect(rankingTab).toHaveAttribute('aria-controls', 'ranking-panel');
    });

    it('sets id on each tab', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      expect(screen.getByRole('tab', { name: /Ranking/ })).toHaveAttribute('id', 'ranking-tab');
      expect(screen.getByRole('tab', { name: /Posts/ })).toHaveAttribute('id', 'posts-tab');
      expect(screen.getByRole('tab', { name: /Times/ })).toHaveAttribute('id', 'teams-tab');
      expect(screen.getByRole('tab', { name: /Jogos/ })).toHaveAttribute('id', 'games-tab');
    });

    it('sets tabIndex 0 on active tab and -1 on inactive tabs', () => {
      render(
        <ProfileTabs
          activeTab="posts"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const postsTab = screen.getByRole('tab', { name: /Posts/ });
      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });

      expect(postsTab).toHaveAttribute('tabIndex', '0');
      expect(rankingTab).toHaveAttribute('tabIndex', '-1');
    });

    it('has descriptive aria-label with count', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      expect(screen.getByRole('tab', { name: 'Ranking (10)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Posts (25)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Times (3)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Jogos (15)' })).toBeInTheDocument();
    });

    it('hides count badge from screen readers with aria-hidden', () => {
      const { container } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      // Count badges should have aria-hidden="true"
      const countBadges = container.querySelectorAll('[aria-hidden="true"]');
      expect(countBadges.length).toBeGreaterThanOrEqual(4);
    });

    it('has focus ring styles for keyboard navigation', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const rankingTab = screen.getByRole('tab', { name: /Ranking/ });
      expect(rankingTab).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-accent');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies scrollable container classes for mobile', () => {
      const { container } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tabsContainer = container.querySelector('[role="tablist"]');
      expect(tabsContainer).toHaveClass('overflow-x-auto');
    });

    it('hides scrollbar with custom CSS', () => {
      const { container } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tabsContainer = container.querySelector('[role="tablist"]');
      expect(tabsContainer).toHaveClass('scrollbar-hide');
    });

    it('has responsive gap between tabs', () => {
      const { container } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tabsContainer = container.querySelector('[role="tablist"]');
      expect(tabsContainer).toHaveClass('gap-1', 'md:gap-2');
    });

    it('centers tabs on desktop', () => {
      const { container } = render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tabsContainer = container.querySelector('[role="tablist"]');
      expect(tabsContainer).toHaveClass('md:justify-center');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onTabChange gracefully', () => {
      expect(() => {
        render(
          <ProfileTabs
            activeTab="ranking"
            counts={defaultCounts}
          />
        );
      }).not.toThrow();
    });

    it('handles empty activeTab', () => {
      render(
        <ProfileTabs
          activeTab=""
          onTabChange={mockOnTabChange}
          counts={defaultCounts}
        />
      );

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('handles null counts', () => {
      render(
        <ProfileTabs
          activeTab="ranking"
          onTabChange={mockOnTabChange}
          counts={null}
        />
      );

      const countBadges = screen.getAllByText('0');
      expect(countBadges).toHaveLength(4);
    });
  });
});
