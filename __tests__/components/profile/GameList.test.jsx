/**
 * GameList Component Tests
 *
 * Test suite covering:
 * - Rendering game cards in list
 * - Loading skeleton states
 * - Empty state display
 * - onGameUpdate callback
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameList from '@/app/components/profile/GameList';

// Mock GameCard component
vi.mock('@/app/components/cards/GameCard', () => ({
  default: ({ game, onGameUpdate }) => (
    <div data-testid={`game-card-${game.id || game.gameId}`}>
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      {onGameUpdate && (
        <button onClick={() => onGameUpdate(game)}>Update Game</button>
      )}
    </div>
  ),
}));

describe('GameList Component', () => {
  const mockGames = [
    {
      id: 1,
      title: 'Amistoso - Time A vs Time B',
      description: 'Jogo amistoso no Parque',
      type: 'FRIENDLY',
      date: '2025-01-15',
      location: 'Parque Municipal',
    },
    {
      id: 2,
      title: 'Campeonato Regional - Semifinal',
      description: 'Semifinal do campeonato',
      type: 'CHAMPIONSHIP',
      date: '2025-01-20',
      location: 'Estádio Central',
    },
    {
      id: 3,
      title: 'Copa Feminina - Final',
      description: 'Grande final da copa',
      type: 'CUP',
      date: '2025-01-25',
      location: 'Arena Principal',
    },
  ];

  const mockOnGameUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Games', () => {
    it('renders game cards in list layout', () => {
      const { container } = render(<GameList games={mockGames} />);

      const list = container.querySelector('.space-y-4');
      expect(list).toBeInTheDocument();
    });

    it('renders all game cards', () => {
      render(<GameList games={mockGames} />);

      expect(screen.getByText('Amistoso - Time A vs Time B')).toBeInTheDocument();
      expect(screen.getByText('Campeonato Regional - Semifinal')).toBeInTheDocument();
      expect(screen.getByText('Copa Feminina - Final')).toBeInTheDocument();
    });

    it('renders game cards with correct test ids', () => {
      render(<GameList games={mockGames} />);

      expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('game-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('game-card-3')).toBeInTheDocument();
    });

    it('handles games with gameId instead of id', () => {
      const gamesWithGameId = [
        {
          gameId: 10,
          title: 'Test Game',
          description: 'Description',
        },
      ];

      render(<GameList games={gamesWithGameId} />);

      expect(screen.getByTestId('game-card-10')).toBeInTheDocument();
    });

    it('has correct spacing between items', () => {
      const { container } = render(<GameList games={mockGames} />);

      const list = container.querySelector('.space-y-4');
      expect(list).toHaveClass('space-y-4');
    });
  });

  describe('Loading State', () => {
    it('shows loading skeletons when isLoading is true', () => {
      const { container } = render(<GameList isLoading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(4);
    });

    it('loading skeletons have correct layout', () => {
      const { container } = render(<GameList isLoading={true} />);

      const list = container.querySelector('.space-y-4');
      expect(list).toBeInTheDocument();
    });

    it('loading skeletons have correct styling', () => {
      const { container } = render(<GameList isLoading={true} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveClass('bg-surface', 'border', 'border-default', 'rounded-2xl', 'p-6');
    });

    it('does not render games when loading', () => {
      render(<GameList games={mockGames} isLoading={true} />);

      expect(screen.queryByText('Amistoso - Time A vs Time B')).not.toBeInTheDocument();
    });

    it('renders exactly 4 skeleton items', () => {
      const { container } = render(<GameList isLoading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(4);
    });

    it('loading skeleton has flex layout for content', () => {
      const { container } = render(<GameList isLoading={true} />);

      const skeletonFlex = container.querySelector('.flex.justify-between.items-start.gap-4');
      expect(skeletonFlex).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when games array is empty', () => {
      render(<GameList games={[]} />);

      expect(screen.getByText('Nenhum jogo encontrado')).toBeInTheDocument();
      expect(screen.getByText('Este perfil ainda não participou de nenhum jogo.')).toBeInTheDocument();
    });

    it('shows empty state when games is null', () => {
      render(<GameList games={null} />);

      expect(screen.getByText('Nenhum jogo encontrado')).toBeInTheDocument();
    });

    it('shows empty state when games is undefined', () => {
      render(<GameList games={undefined} />);

      expect(screen.getByText('Nenhum jogo encontrado')).toBeInTheDocument();
    });

    it('empty state has Calendar icon', () => {
      const { container } = render(<GameList games={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('empty state has correct styling', () => {
      const { container } = render(<GameList games={[]} />);

      const emptyState = container.querySelector('.bg-surface-muted');
      expect(emptyState).toHaveClass('border', 'border-default', 'rounded-2xl', 'p-8', 'md:p-12', 'text-center');
    });

    it('empty state title has correct styling', () => {
      render(<GameList games={[]} />);

      const title = screen.getByText('Nenhum jogo encontrado');
      expect(title).toHaveClass('text-xl', 'md:text-2xl', 'font-bold', 'text-primary', 'mb-2');
    });

    it('empty state description has correct styling', () => {
      render(<GameList games={[]} />);

      const description = screen.getByText('Este perfil ainda não participou de nenhum jogo.');
      expect(description).toHaveClass('text-secondary', 'text-sm', 'md:text-base', 'mb-6');
    });

    it('does not render list when showing empty state', () => {
      const { container } = render(<GameList games={[]} />);

      const list = container.querySelector('.space-y-4:not(.bg-surface-muted *)');
      expect(list).not.toBeInTheDocument();
    });
  });

  describe('onGameUpdate Callback', () => {
    it('passes onGameUpdate to GameCard components', () => {
      render(<GameList games={mockGames} onGameUpdate={mockOnGameUpdate} />);

      const updateButtons = screen.getAllByText('Update Game');
      expect(updateButtons).toHaveLength(3);
    });

    it('calls onGameUpdate with correct game when triggered', async () => {
      render(<GameList games={mockGames} onGameUpdate={mockOnGameUpdate} />);

      const updateButtons = screen.getAllByText('Update Game');
      updateButtons[0].click();

      expect(mockOnGameUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnGameUpdate).toHaveBeenCalledWith(mockGames[0]);
    });

    it('handles missing onGameUpdate gracefully', () => {
      render(<GameList games={mockGames} />);

      // Should still render without onGameUpdate
      expect(screen.getByText('Amistoso - Time A vs Time B')).toBeInTheDocument();
    });

    it('can call onGameUpdate for different games', () => {
      render(<GameList games={mockGames} onGameUpdate={mockOnGameUpdate} />);

      const updateButtons = screen.getAllByText('Update Game');

      updateButtons[0].click();
      expect(mockOnGameUpdate).toHaveBeenLastCalledWith(mockGames[0]);

      updateButtons[1].click();
      expect(mockOnGameUpdate).toHaveBeenLastCalledWith(mockGames[1]);

      updateButtons[2].click();
      expect(mockOnGameUpdate).toHaveBeenLastCalledWith(mockGames[2]);

      expect(mockOnGameUpdate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Responsive Design', () => {
    it('empty state icon has responsive sizing', () => {
      const { container } = render(<GameList games={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-12', 'w-12', 'md:h-16', 'md:w-16');
    });

    it('empty state has responsive padding', () => {
      const { container } = render(<GameList games={[]} />);

      const emptyState = container.querySelector('.bg-surface-muted');
      expect(emptyState).toHaveClass('p-8', 'md:p-12');
    });

    it('empty state title has responsive text size', () => {
      render(<GameList games={[]} />);

      const title = screen.getByText('Nenhum jogo encontrado');
      expect(title).toHaveClass('text-xl', 'md:text-2xl');
    });

    it('empty state description has responsive text size', () => {
      render(<GameList games={[]} />);

      const description = screen.getByText('Este perfil ainda não participou de nenhum jogo.');
      expect(description).toHaveClass('text-sm', 'md:text-base');
    });
  });

  describe('Edge Cases', () => {
    it('handles single game correctly', () => {
      render(<GameList games={[mockGames[0]]} />);

      expect(screen.getByText('Amistoso - Time A vs Time B')).toBeInTheDocument();
      expect(screen.queryByText('Campeonato Regional - Semifinal')).not.toBeInTheDocument();
    });

    it('handles large number of games', () => {
      const manyGames = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Game ${i}`,
        description: `Description ${i}`,
      }));

      render(<GameList games={manyGames} />);

      expect(screen.getByText('Game 0')).toBeInTheDocument();
      expect(screen.getByText('Game 99')).toBeInTheDocument();
    });

    it('handles games with missing optional fields', () => {
      const minimalGames = [
        {
          id: 1,
          title: 'Minimal Game',
        },
      ];

      render(<GameList games={minimalGames} />);

      expect(screen.getByText('Minimal Game')).toBeInTheDocument();
    });

    it('handles games with both id and gameId (prioritizes id)', () => {
      const games = [
        {
          id: 1,
          gameId: 999,
          title: 'Test Game',
          description: 'Test',
        },
      ];

      render(<GameList games={games} />);

      // Should use id, not gameId
      expect(screen.getByTestId('game-card-1')).toBeInTheDocument();
    });

    it('does not crash with empty objects in game data', () => {
      const gamesWithEmpty = [
        {},
        { id: 1, title: 'Valid Game' },
      ];

      expect(() => {
        render(<GameList games={gamesWithEmpty} />);
      }).not.toThrow();
    });

    it('handles isLoading=false explicitly', () => {
      render(<GameList games={mockGames} isLoading={false} />);

      expect(screen.getByText('Amistoso - Time A vs Time B')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });

    it('handles empty array vs undefined games', () => {
      const { container: emptyContainer } = render(<GameList games={[]} />);
      const { container: undefinedContainer } = render(<GameList games={undefined} />);

      // Both should show empty state
      expect(emptyContainer.querySelector('.bg-surface-muted')).toBeInTheDocument();
      expect(undefinedContainer.querySelector('.bg-surface-muted')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('empty state icon has proper opacity for visibility', () => {
      const { container } = render(<GameList games={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('opacity-50');
    });

    it('empty state uses semantic heading', () => {
      render(<GameList games={[]} />);

      const heading = screen.getByRole('heading', { name: 'Nenhum jogo encontrado' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('loading skeletons have proper background contrast', () => {
      const { container } = render(<GameList isLoading={true} />);

      const skeletonContent = container.querySelector('.bg-surface-elevated');
      expect(skeletonContent).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('games defaults to empty array', () => {
      render(<GameList />);

      expect(screen.getByText('Nenhum jogo encontrado')).toBeInTheDocument();
    });

    it('isLoading defaults to false', () => {
      render(<GameList games={mockGames} />);

      expect(screen.getByText('Amistoso - Time A vs Time B')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });

    it('onGameUpdate is optional', () => {
      expect(() => {
        render(<GameList games={mockGames} />);
      }).not.toThrow();
    });
  });
});
