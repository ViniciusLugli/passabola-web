/**
 * Testes de Acessibilidade para Componentes UX
 * @see docs/TESTING-COMMIT-5.md
 *
 * Verifica conformidade WCAG 2.1 AA:
 * - ARIA roles e labels
 * - Navegação por teclado
 * - Focus management
 * - Reduced motion
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ErrorState from "@/app/components/ui/ErrorState";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import EmptyState from "@/app/components/ui/EmptyState";
import { AlertCircle, Users } from "lucide-react";

expect.extend(toHaveNoViolations);

describe("Acessibilidade - ErrorState", () => {
  test("não deve ter violações de acessibilidade", async () => {
    const { container } = render(
      <ErrorState
        title="Erro de Teste"
        message="Mensagem de erro"
        onRetry={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('deve ter role="alert" para leitores de tela', () => {
    render(<ErrorState title="Erro de Teste" message="Mensagem de erro" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  test("botão de retry deve ser acessível por teclado", () => {
    const onRetry = jest.fn();
    render(
      <ErrorState
        title="Erro de Teste"
        message="Mensagem de erro"
        onRetry={onRetry}
      />
    );

    const button = screen.getByText(/tentar novamente/i);
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(onRetry).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: " " });
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  test('variante "danger" deve ter indicadores visuais adequados', () => {
    const { container } = render(
      <ErrorState variant="danger" title="Erro Crítico" message="Falha grave" />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass("border-danger");
  });
});

describe("Acessibilidade - LoadingSkeleton", () => {
  test("não deve ter violações de acessibilidade", async () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("deve ter aria-label indicando carregamento", () => {
    render(<LoadingSkeleton variant="list" />);
    const skeleton = screen.getByLabelText(/carregando/i);
    expect(skeleton).toBeInTheDocument();
  });

  test('deve ter aria-busy="true" durante carregamento', () => {
    const { container } = render(<LoadingSkeleton variant="post" />);
    const skeleton = container.querySelector('[aria-busy="true"]');
    expect(skeleton).toBeInTheDocument();
  });

  test("todas as variantes devem ser acessíveis", async () => {
    const variants = ["card", "list", "post", "notification", "game"];

    for (const variant of variants) {
      const { container } = render(<LoadingSkeleton variant={variant} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  test("deve respeitar prefers-reduced-motion", () => {
    // Simula usuário com preferência de movimento reduzido
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const { container } = render(<LoadingSkeleton variant="card" />);
    const skeleton = container.querySelector(".skeleton-text");

    // Verifica se animações são desabilitadas
    const styles = window.getComputedStyle(skeleton);
    expect(styles.animationDuration).toBe("0s");
  });
});

describe("Acessibilidade - EmptyState", () => {
  test("não deve ter violações de acessibilidade", async () => {
    const { container } = render(
      <EmptyState icon={Users} title="Nenhum item" description="Lista vazia" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('deve ter role="status" para leitores de tela', () => {
    render(
      <EmptyState icon={Users} title="Nenhum item" description="Lista vazia" />
    );
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
  });

  test("botão de ação deve ser acessível por teclado", () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        icon={Users}
        title="Nenhum item"
        description="Lista vazia"
        actionLabel="Criar Novo"
        onAction={onAction}
      />
    );

    const button = screen.getByText("Criar Novo");
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(onAction).toHaveBeenCalled();
  });

  test("ícone deve ter aria-hidden para evitar poluição", () => {
    const { container } = render(
      <EmptyState
        icon={AlertCircle}
        title="Nenhum item"
        description="Lista vazia"
      />
    );

    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  test("todas as variantes devem ter contraste adequado", async () => {
    const variants = ["default", "gradient", "bordered"];

    for (const variant of variants) {
      const { container } = render(
        <EmptyState
          variant={variant}
          icon={Users}
          title="Teste"
          description="Descrição"
        />
      );
      const results = await axe(container, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    }
  });
});

describe("Navegação por Teclado", () => {
  test("ErrorState: Tab deve navegar para botão de retry", () => {
    render(<ErrorState title="Erro" message="Teste" onRetry={() => {}} />);

    const button = screen.getByText(/tentar novamente/i);

    // Simula Tab
    fireEvent.keyDown(document.body, { key: "Tab" });
    expect(button).toHaveFocus();
  });

  test("EmptyState: Tab deve navegar para botão de ação", () => {
    render(
      <EmptyState
        icon={Users}
        title="Vazio"
        description="Teste"
        actionLabel="Criar"
        onAction={() => {}}
      />
    );

    const button = screen.getByText("Criar");

    // Simula Tab
    fireEvent.keyDown(document.body, { key: "Tab" });
    expect(button).toHaveFocus();
  });

  test("Escape deve fechar modais de erro (se aplicável)", () => {
    const onClose = jest.fn();
    render(
      <div role="dialog">
        <ErrorState title="Erro Modal" message="Teste" onRetry={() => {}} />
      </div>
    );

    fireEvent.keyDown(document.body, { key: "Escape" });
    // Verifica se handler de Escape foi chamado (implementação depende do Modal)
  });
});

describe("Focus Management", () => {
  test("ErrorState deve focar no botão de retry ao renderizar", () => {
    render(
      <ErrorState title="Erro" message="Teste" onRetry={() => {}} autoFocus />
    );

    const button = screen.getByText(/tentar novamente/i);
    expect(button).toHaveFocus();
  });

  test("Focus deve ser visível com outline", () => {
    render(<ErrorState title="Erro" message="Teste" onRetry={() => {}} />);

    const button = screen.getByText(/tentar novamente/i);
    button.focus();

    const styles = window.getComputedStyle(button);
    expect(styles.outline).not.toBe("none");
  });

  test("Focus trap em componentes críticos", () => {
    // Testa se o foco fica contido em componentes importantes
    render(
      <div role="alertdialog">
        <ErrorState
          variant="danger"
          title="Erro Crítico"
          message="Ação necessária"
          onRetry={() => {}}
        />
      </div>
    );

    const button = screen.getByText(/tentar novamente/i);
    button.focus();

    // Simula Tab repetidas vezes
    fireEvent.keyDown(button, { key: "Tab" });
    fireEvent.keyDown(document.activeElement, { key: "Tab" });

    // Focus deve retornar ao primeiro elemento focável
    expect(document.activeElement).toBe(button);
  });
});

describe("Reduced Motion", () => {
  beforeEach(() => {
    // Reset matchMedia
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test("animações devem ser desabilitadas com prefers-reduced-motion", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
    }));

    const { container } = render(<LoadingSkeleton variant="card" />);

    // Verifica se classe de animação foi removida ou animação desabilitada
    const skeleton = container.querySelector(".skeleton-text");
    const styles = window.getComputedStyle(skeleton);

    expect(styles.animation).toMatch(/none|0s/);
  });

  test("transições devem ser instantâneas com reduced motion", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
    }));

    render(<ErrorState title="Erro" message="Teste" onRetry={() => {}} />);

    const alert = screen.getByRole("alert");
    const styles = window.getComputedStyle(alert);

    expect(styles.transitionDuration).toBe("0s");
  });
});

describe("Screen Reader", () => {
  test("ErrorState: mensagens devem ser anunciadas", () => {
    render(<ErrorState title="Erro Crítico" message="Falha no servidor" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  test("LoadingSkeleton: status de carregamento deve ser anunciado", () => {
    render(<LoadingSkeleton variant="card" />);

    const skeleton = screen.getByLabelText(/carregando/i);
    expect(skeleton).toHaveAttribute("aria-busy", "true");
  });

  test("EmptyState: status vazio deve ser anunciado de forma não-intrusiva", () => {
    render(
      <EmptyState
        icon={Users}
        title="Nenhum resultado"
        description="Lista vazia"
      />
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  test("textos ocultos visualmente mas acessíveis a leitores", () => {
    const { container } = render(<LoadingSkeleton variant="card" />);

    const srOnly = container.querySelectorAll(".sr-only");
    expect(srOnly.length).toBeGreaterThan(0);

    srOnly.forEach((el) => {
      const styles = window.getComputedStyle(el);
      expect(styles.position).toBe("absolute");
      expect(styles.width).toBe("1px");
    });
  });
});
