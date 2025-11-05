/**
 * TeamList Component Tests
 *
 * Test suite covering:
 * - Rendering team cards in grid
 * - Loading skeleton states
 * - Empty state display
 * - Responsive grid layout
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TeamList from '@/app/components/profile/TeamList';

// Mock TeamCard component
vi.mock('@/app/components/cards/TeamCard', () => ({
  default: ({ team }) => (
    <div data-testid={`team-card-${team.id || team.teamId}`}>
      <h3>{team.name}</h3>
      <p>{team.description}</p>
    </div>
  ),
}));

describe('TeamList Component', () => {
  const mockTeams = [
    {
      id: 1,
      name: 'Time das Leoas',
      description: 'Time feminino de São Paulo',
      category: 'FEMININO',
      members: 12,
    },
    {
      id: 2,
      name: 'Guerreiras FC',
      description: 'Time feminino do Rio de Janeiro',
      category: 'FEMININO',
      members: 15,
    },
    {
      id: 3,
      name: 'Estrelas do Futebol',
      description: 'Time misto de Minas Gerais',
      category: 'MISTO',
      members: 20,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Teams', () => {
    it('renders team cards in grid layout', () => {
      const { container } = render(<TeamList teams={mockTeams} />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('renders all team cards', () => {
      render(<TeamList teams={mockTeams} />);

      expect(screen.getByText('Time das Leoas')).toBeInTheDocument();
      expect(screen.getByText('Guerreiras FC')).toBeInTheDocument();
      expect(screen.getByText('Estrelas do Futebol')).toBeInTheDocument();
    });

    it('renders team cards with correct test ids', () => {
      render(<TeamList teams={mockTeams} />);

      expect(screen.getByTestId('team-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('team-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('team-card-3')).toBeInTheDocument();
    });

    it('handles teams with teamId instead of id', () => {
      const teamsWithTeamId = [
        {
          teamId: 10,
          name: 'Test Team',
          description: 'Description',
        },
      ];

      render(<TeamList teams={teamsWithTeamId} />);

      expect(screen.getByTestId('team-card-10')).toBeInTheDocument();
    });

    it('has correct grid gap', () => {
      const { container } = render(<TeamList teams={mockTeams} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });
  });

  describe('Loading State', () => {
    it('shows loading skeletons when isLoading is true', () => {
      const { container } = render(<TeamList isLoading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(6);
    });

    it('loading skeletons have correct layout', () => {
      const { container } = render(<TeamList isLoading={true} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('loading skeletons have correct styling', () => {
      const { container } = render(<TeamList isLoading={true} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveClass('bg-surface', 'border', 'border-default', 'rounded-xl', 'p-5');
    });

    it('does not render teams when loading', () => {
      render(<TeamList teams={mockTeams} isLoading={true} />);

      expect(screen.queryByText('Time das Leoas')).not.toBeInTheDocument();
    });

    it('renders exactly 6 skeleton items', () => {
      const { container } = render(<TeamList isLoading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(6);
    });
  });

  describe('Empty State', () => {
    it('shows empty state when teams array is empty', () => {
      render(<TeamList teams={[]} />);

      expect(screen.getByText('Nenhum time encontrado')).toBeInTheDocument();
      expect(screen.getByText('Este perfil ainda não participa de nenhum time.')).toBeInTheDocument();
    });

    it('shows empty state when teams is null', () => {
      render(<TeamList teams={null} />);

      expect(screen.getByText('Nenhum time encontrado')).toBeInTheDocument();
    });

    it('shows empty state when teams is undefined', () => {
      render(<TeamList teams={undefined} />);

      expect(screen.getByText('Nenhum time encontrado')).toBeInTheDocument();
    });

    it('empty state has Users icon', () => {
      const { container } = render(<TeamList teams={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('empty state has correct styling', () => {
      const { container } = render(<TeamList teams={[]} />);

      const emptyState = container.querySelector('.bg-surface-muted');
      expect(emptyState).toHaveClass('border', 'border-default', 'rounded-2xl', 'p-8', 'md:p-12', 'text-center');
    });

    it('empty state title has correct styling', () => {
      render(<TeamList teams={[]} />);

      const title = screen.getByText('Nenhum time encontrado');
      expect(title).toHaveClass('text-xl', 'md:text-2xl', 'font-bold', 'text-primary', 'mb-2');
    });

    it('empty state description has correct styling', () => {
      render(<TeamList teams={[]} />);

      const description = screen.getByText('Este perfil ainda não participa de nenhum time.');
      expect(description).toHaveClass('text-secondary', 'text-sm', 'md:text-base', 'mb-6');
    });

    it('does not render grid when showing empty state', () => {
      const { container } = render(<TeamList teams={[]} />);

      const grid = container.querySelector('.grid.grid-cols-1');
      expect(grid).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('grid has responsive column classes', () => {
      const { container } = render(<TeamList teams={mockTeams} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1'); // Mobile: 1 column
      expect(grid).toHaveClass('md:grid-cols-2'); // Tablet: 2 columns
      expect(grid).toHaveClass('lg:grid-cols-3'); // Desktop: 3 columns
    });

    it('empty state icon has responsive sizing', () => {
      const { container } = render(<TeamList teams={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-12', 'w-12', 'md:h-16', 'md:w-16');
    });

    it('empty state has responsive padding', () => {
      const { container } = render(<TeamList teams={[]} />);

      const emptyState = container.querySelector('.bg-surface-muted');
      expect(emptyState).toHaveClass('p-8', 'md:p-12');
    });

    it('empty state title has responsive text size', () => {
      render(<TeamList teams={[]} />);

      const title = screen.getByText('Nenhum time encontrado');
      expect(title).toHaveClass('text-xl', 'md:text-2xl');
    });

    it('empty state description has responsive text size', () => {
      render(<TeamList teams={[]} />);

      const description = screen.getByText('Este perfil ainda não participa de nenhum time.');
      expect(description).toHaveClass('text-sm', 'md:text-base');
    });
  });

  describe('Edge Cases', () => {
    it('handles single team correctly', () => {
      render(<TeamList teams={[mockTeams[0]]} />);

      expect(screen.getByText('Time das Leoas')).toBeInTheDocument();
      expect(screen.queryByText('Guerreiras FC')).not.toBeInTheDocument();
    });

    it('handles large number of teams', () => {
      const manyTeams = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Team ${i}`,
        description: `Description ${i}`,
      }));

      render(<TeamList teams={manyTeams} />);

      expect(screen.getByText('Team 0')).toBeInTheDocument();
      expect(screen.getByText('Team 49')).toBeInTheDocument();
    });

    it('handles teams with missing optional fields', () => {
      const minimalTeams = [
        {
          id: 1,
          name: 'Minimal Team',
        },
      ];

      render(<TeamList teams={minimalTeams} />);

      expect(screen.getByText('Minimal Team')).toBeInTheDocument();
    });

    it('handles teams with both id and teamId (prioritizes id)', () => {
      const teams = [
        {
          id: 1,
          teamId: 999,
          name: 'Test Team',
          description: 'Test',
        },
      ];

      render(<TeamList teams={teams} />);

      // Should use id, not teamId
      expect(screen.getByTestId('team-card-1')).toBeInTheDocument();
    });

    it('does not crash with empty objects in team data', () => {
      const teamsWithEmpty = [
        {},
        { id: 1, name: 'Valid Team' },
      ];

      expect(() => {
        render(<TeamList teams={teamsWithEmpty} />);
      }).not.toThrow();
    });

    it('handles isLoading=false explicitly', () => {
      render(<TeamList teams={mockTeams} isLoading={false} />);

      expect(screen.getByText('Time das Leoas')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });

    it('handles empty array vs undefined teams differently', () => {
      const { container: emptyContainer } = render(<TeamList teams={[]} />);
      const { container: undefinedContainer } = render(<TeamList teams={undefined} />);

      // Both should show empty state
      expect(emptyContainer.querySelector('.bg-surface-muted')).toBeInTheDocument();
      expect(undefinedContainer.querySelector('.bg-surface-muted')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('empty state icon has proper opacity for visibility', () => {
      const { container } = render(<TeamList teams={[]} />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('opacity-50');
    });

    it('empty state uses semantic heading', () => {
      render(<TeamList teams={[]} />);

      const heading = screen.getByRole('heading', { name: 'Nenhum time encontrado' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('loading skeletons have proper background contrast', () => {
      const { container } = render(<TeamList isLoading={true} />);

      const skeletonContent = container.querySelector('.bg-surface-elevated');
      expect(skeletonContent).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    it('teams defaults to empty array', () => {
      render(<TeamList />);

      expect(screen.getByText('Nenhum time encontrado')).toBeInTheDocument();
    });

    it('isLoading defaults to false', () => {
      render(<TeamList teams={mockTeams} />);

      expect(screen.getByText('Time das Leoas')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
  });
});
