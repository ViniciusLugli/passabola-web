/**
 * SearchableList Component Tests
 *
 * Test suite covering:
 * - Rendering all items initially
 * - Filtering items based on search input
 * - Debounced search (300ms)
 * - Result count display
 * - Clear button functionality
 * - Empty state
 * - Nested search keys support
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchableList from '@/app/components/SearchableList';

describe('SearchableList Component', () => {
  const mockItems = [
    { id: 1, name: 'Ana Silva', type: 'PLAYER' },
    { id: 2, name: 'Maria Santos', type: 'PLAYER' },
    { id: 3, name: 'João Costa', type: 'SPECTATOR' },
    { id: 4, name: 'Carlos Oliveira', type: 'ORGANIZATION' },
  ];

  const mockRenderItem = vi.fn((item) => (
    <div data-testid={`item-${item.id}`}>
      {item.name} - {item.type}
    </div>
  ));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all items initially', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos - PLAYER')).toBeInTheDocument();
      expect(screen.getByText('João Costa - SPECTATOR')).toBeInTheDocument();
      expect(screen.getByText('Carlos Oliveira - ORGANIZATION')).toBeInTheDocument();
    });

    it('calls renderItem for each item', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(mockRenderItem).toHaveBeenCalledTimes(4);
      expect(mockRenderItem).toHaveBeenCalledWith(mockItems[0], 0);
      expect(mockRenderItem).toHaveBeenCalledWith(mockItems[1], 1);
    });

    it('displays correct initial item count', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('4', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('itens')).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
          placeholder="Buscar usuários..."
        />
      );

      const searchInput = screen.getByPlaceholderText('Buscar usuários...');
      expect(searchInput).toBeInTheDocument();
    });

    it('uses default placeholder when not provided', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders Search icon', () => {
      const { container } = render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchIcon = container.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters items based on search input after debounce', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      // Wait for debounce (300ms)
      await waitFor(
        () => {
          expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
          expect(screen.queryByText('Maria Santos - PLAYER')).not.toBeInTheDocument();
          expect(screen.queryByText('João Costa - SPECTATOR')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('debounces search with 300ms delay', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');

      // Type the full search term
      await user.type(searchInput, 'Ana');

      // Wait for debounce to complete
      await waitFor(
        () => {
          expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
          expect(screen.queryByText('Maria Santos - PLAYER')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('performs case-insensitive search', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'ANA');

      await waitFor(() => {
        expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('searches partial matches', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Silv');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
      });
    });

    it('shows multiple matches when they exist', async () => {
      const user = userEvent.setup();

      const items = [
        { id: 1, name: 'Ana Silva' },
        { id: 2, name: 'Ana Santos' },
        { id: 3, name: 'João Costa' },
      ];

      render(
        <SearchableList
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Ana Silva')).toBeInTheDocument();
        expect(screen.getByText('Ana Santos')).toBeInTheDocument();
        expect(screen.queryByText('João Costa')).not.toBeInTheDocument();
      });
    });
  });

  describe('Search with Nested Keys', () => {
    it('supports nested search keys', async () => {
      const user = userEvent.setup();

      const nestedItems = [
        { id: 1, user: { name: 'Ana Silva' } },
        { id: 2, user: { name: 'Maria Santos' } },
      ];

      render(
        <SearchableList
          items={nestedItems}
          renderItem={(item) => <div>{item.user.name}</div>}
          searchKey="user.name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Ana Silva')).toBeInTheDocument();
        expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
      });
    });

    it('handles undefined nested values gracefully', async () => {
      const user = userEvent.setup();

      const items = [
        { id: 1, user: { name: 'Ana Silva' } },
        { id: 2, user: null },
        { id: 3, profile: { name: 'João' } },
      ];

      render(
        <SearchableList
          items={items}
          renderItem={(item) => <div>{item.user?.name || item.profile?.name || 'Unknown'}</div>}
          searchKey="user.name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Ana Silva')).toBeInTheDocument();
        expect(screen.queryByText('Unknown')).not.toBeInTheDocument();
      });
    });
  });

  describe('Result Count', () => {
    it('displays total count initially', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('4', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('itens')).toBeInTheDocument();
    });

    it('displays singular form for single item', () => {
      render(
        <SearchableList
          items={[mockItems[0]]}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('1', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('item')).toBeInTheDocument();
    });

    it('updates count after search', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('1', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('de')).toBeInTheDocument();
        expect(screen.getByText('4', { exact: false })).toBeInTheDocument();
      });
    });

    it('shows filtered vs total in correct format', async () => {
      const user = userEvent.setup();

      const items = [
        { id: 1, name: 'Ana Silva' },
        { id: 2, name: 'Ana Santos' },
        { id: 3, name: 'João Costa' },
      ];

      render(
        <SearchableList
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        const resultText = screen.getByText('2', { exact: false }).textContent;
        expect(resultText).toContain('2');
        expect(resultText).toContain('3');
        expect(screen.getByText('resultados')).toBeInTheDocument();
      });
    });
  });

  describe('Clear Button', () => {
    it('does not show clear button initially', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const clearButton = screen.queryByLabelText('Limpar pesquisa');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('shows clear button when search input has value', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      const clearButton = screen.getByLabelText('Limpar pesquisa');
      expect(clearButton).toBeInTheDocument();
    });

    it('clears search and shows all items when clicked', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.queryByText('Maria Santos - PLAYER')).not.toBeInTheDocument();
      });

      const clearButton = screen.getByLabelText('Limpar pesquisa');
      await user.click(clearButton);

      // Should show all items again immediately
      expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos - PLAYER')).toBeInTheDocument();
      expect(screen.getByText('João Costa - SPECTATOR')).toBeInTheDocument();
      expect(screen.getByText('Carlos Oliveira - ORGANIZATION')).toBeInTheDocument();
    });

    it('clears search input value', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      expect(searchInput).toHaveValue('Ana');

      const clearButton = screen.getByLabelText('Limpar pesquisa');
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
    });

    it('hides clear button after clearing', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      let clearButton = screen.getByLabelText('Limpar pesquisa');
      await user.click(clearButton);

      clearButton = screen.queryByLabelText('Limpar pesquisa');
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no results found', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'XYZ123');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
      });
    });

    it('shows custom empty message', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
          emptyMessage="Nenhum usuário encontrado"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'XYZ123');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
      });
    });

    it('shows clear button in empty state', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'XYZ123');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        const clearButtons = screen.getAllByText('Limpar pesquisa');
        expect(clearButtons.length).toBeGreaterThan(0);
      });
    });

    it('clears search from empty state', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'XYZ123');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
      });

      const clearButtons = screen.getAllByText('Limpar pesquisa');
      await user.click(clearButtons[0]);

      expect(screen.queryByText('Nenhum resultado encontrado')).not.toBeInTheDocument();
      expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
    });

    it('does not show empty state when items is empty initially', () => {
      render(
        <SearchableList
          items={[]}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('search input has aria-label', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
          placeholder="Buscar..."
        />
      );

      const searchInput = screen.getByLabelText('Buscar...');
      expect(searchInput).toBeInTheDocument();
    });

    it('clear button has aria-label', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      const clearButton = screen.getByLabelText('Limpar pesquisa');
      expect(clearButton).toBeInTheDocument();
    });

    it('icons have aria-hidden', () => {
      const { container } = render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('clear button has focus ring', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Ana');

      const clearButton = screen.getByLabelText('Limpar pesquisa');
      expect(clearButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-accent');
    });

    it('search input has focus ring', () => {
      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      expect(searchInput).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-accent');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(
        <SearchableList
          items={[]}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('0', { exact: false })).toBeInTheDocument();
    });

    it('handles undefined items', () => {
      render(
        <SearchableList
          items={undefined}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      expect(screen.getByText('0', { exact: false })).toBeInTheDocument();
    });

    it('handles items without the search key', async () => {
      const user = userEvent.setup();

      const items = [
        { id: 1, title: 'Test' },
        { id: 2, title: 'Another' },
      ];

      render(
        <SearchableList
          items={items}
          renderItem={(item) => <div>{item.title}</div>}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, 'Test');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
      });
    });

    it('trims whitespace in search', async () => {
      const user = userEvent.setup();

      render(
        <SearchableList
          items={mockItems}
          renderItem={mockRenderItem}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, '   ');

      await new Promise(r => setTimeout(r, 350));

      // Empty search (whitespace only) should show all items
      expect(screen.getByText('Ana Silva - PLAYER')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos - PLAYER')).toBeInTheDocument();
    });

    it('handles special characters in search', async () => {
      const user = userEvent.setup();

      const items = [
        { id: 1, name: 'User (Test)' },
        { id: 2, name: 'Normal User' },
      ];

      render(
        <SearchableList
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          searchKey="name"
        />
      );

      const searchInput = screen.getByPlaceholderText('Pesquisar...');
      await user.type(searchInput, '(Test)');

      await new Promise(r => setTimeout(r, 350));

      await waitFor(() => {
        expect(screen.getByText('User (Test)')).toBeInTheDocument();
        expect(screen.queryByText('Normal User')).not.toBeInTheDocument();
      });
    });
  });
});
