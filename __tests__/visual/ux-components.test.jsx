/**
 * Testes de Regressão Visual para Componentes UX
 * @see docs/TESTING-COMMIT-5.md
 *
 * Verifica:
 * - Consistência visual entre renders
 * - Dark mode
 * - Responsividade
 * - Estados de hover/focus
 */

import { render } from "@testing-library/react";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import ErrorState from "@/app/components/ui/ErrorState";
import LoadingSkeleton from "@/app/components/ui/LoadingSkeleton";
import EmptyState from "@/app/components/ui/EmptyState";
import { Users, AlertCircle } from "lucide-react";

expect.extend({ toMatchImageSnapshot });

describe("Visual Regression - ErrorState", () => {
  test('variante "error" deve corresponder ao snapshot', () => {
    const { container } = render(
      <ErrorState
        variant="error"
        title="Erro de Teste"
        message="Mensagem de erro de teste"
        onRetry={() => {}}
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-error-variant",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "warning" deve corresponder ao snapshot', () => {
    const { container } = render(
      <ErrorState
        variant="warning"
        title="Aviso de Teste"
        message="Mensagem de aviso de teste"
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-warning-variant",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "danger" deve corresponder ao snapshot', () => {
    const { container } = render(
      <ErrorState
        variant="danger"
        title="Perigo de Teste"
        message="Mensagem de perigo de teste"
        onRetry={() => {}}
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-danger-variant",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("dark mode deve corresponder ao snapshot", () => {
    document.documentElement.classList.add("dark");

    const { container } = render(
      <ErrorState
        title="Erro Dark Mode"
        message="Teste de tema escuro"
        onRetry={() => {}}
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-dark-mode",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });

    document.documentElement.classList.remove("dark");
  });
});

describe("Visual Regression - LoadingSkeleton", () => {
  test('variante "card" deve corresponder ao snapshot', () => {
    const { container } = render(<LoadingSkeleton variant="card" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-card",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "list" deve corresponder ao snapshot', () => {
    const { container } = render(<LoadingSkeleton variant="list" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-list",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "post" deve corresponder ao snapshot', () => {
    const { container } = render(<LoadingSkeleton variant="post" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-post",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "notification" deve corresponder ao snapshot', () => {
    const { container } = render(<LoadingSkeleton variant="notification" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-notification",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "game" deve corresponder ao snapshot', () => {
    const { container } = render(<LoadingSkeleton variant="game" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-game",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("shimmer animation frame 1 vs frame N", async () => {
    const { container } = render(<LoadingSkeleton variant="card" />);

    // Captura frame inicial
    const frame1 = container.firstChild;
    expect(frame1).toMatchImageSnapshot({
      customSnapshotIdentifier: "skeleton-shimmer-frame1",
    });

    // Aguarda animação
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Captura frame após 1s
    expect(frame1).toMatchImageSnapshot({
      customSnapshotIdentifier: "skeleton-shimmer-frame2",
      failureThreshold: 0.1, // Permite diferença de animação
      failureThresholdType: "percent",
    });
  });

  test("dark mode skeleton deve corresponder ao snapshot", () => {
    document.documentElement.classList.add("dark");

    const { container } = render(<LoadingSkeleton variant="card" />);

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "loading-skeleton-dark-mode",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });

    document.documentElement.classList.remove("dark");
  });
});

describe("Visual Regression - EmptyState", () => {
  test('variante "default" deve corresponder ao snapshot', () => {
    const { container } = render(
      <EmptyState
        variant="default"
        icon={Users}
        title="Nenhum item"
        description="Lista vazia de teste"
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-default",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "gradient" deve corresponder ao snapshot', () => {
    const { container } = render(
      <EmptyState
        variant="gradient"
        icon={AlertCircle}
        title="Nenhum resultado"
        description="Teste de gradient"
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-gradient",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test('variante "bordered" deve corresponder ao snapshot', () => {
    const { container } = render(
      <EmptyState
        variant="bordered"
        icon={Users}
        title="Lista vazia"
        description="Teste de bordered"
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-bordered",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("com botão de ação deve corresponder ao snapshot", () => {
    const { container } = render(
      <EmptyState
        icon={Users}
        title="Sem resultados"
        description="Teste com ação"
        actionLabel="Criar Novo"
        onAction={() => {}}
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-with-action",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("dark mode deve corresponder ao snapshot", () => {
    document.documentElement.classList.add("dark");

    const { container } = render(
      <EmptyState
        icon={Users}
        title="Dark Mode"
        description="Teste de tema escuro"
        actionLabel="Ação"
        onAction={() => {}}
      />
    );

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-dark-mode",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });

    document.documentElement.classList.remove("dark");
  });
});

describe("Visual Regression - Responsividade", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`ErrorState em ${name} (${width}x${height})`, () => {
      global.innerWidth = width;
      global.innerHeight = height;

      const { container } = render(
        <div style={{ width, height }}>
          <ErrorState
            title="Erro Responsivo"
            message="Teste de responsividade"
            onRetry={() => {}}
          />
        </div>
      );

      expect(container.firstChild).toMatchImageSnapshot({
        customSnapshotIdentifier: `error-state-${name}`,
        failureThreshold: 0.01,
        failureThresholdType: "percent",
      });
    });

    test(`LoadingSkeleton em ${name} (${width}x${height})`, () => {
      global.innerWidth = width;
      global.innerHeight = height;

      const { container } = render(
        <div style={{ width, height }}>
          <LoadingSkeleton variant="card" />
        </div>
      );

      expect(container.firstChild).toMatchImageSnapshot({
        customSnapshotIdentifier: `loading-skeleton-${name}`,
        failureThreshold: 0.01,
        failureThresholdType: "percent",
      });
    });

    test(`EmptyState em ${name} (${width}x${height})`, () => {
      global.innerWidth = width;
      global.innerHeight = height;

      const { container } = render(
        <div style={{ width, height }}>
          <EmptyState
            icon={Users}
            title="Estado Vazio"
            description="Teste responsivo"
            actionLabel="Ação"
            onAction={() => {}}
          />
        </div>
      );

      expect(container.firstChild).toMatchImageSnapshot({
        customSnapshotIdentifier: `empty-state-${name}`,
        failureThreshold: 0.01,
        failureThresholdType: "percent",
      });
    });
  });
});

describe("Visual Regression - Estados Interativos", () => {
  test("botão de retry com hover", () => {
    const { container } = render(
      <ErrorState
        title="Erro com Hover"
        message="Teste de hover"
        onRetry={() => {}}
      />
    );

    const button = container.querySelector("button");
    button?.classList.add("hover");

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-button-hover",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("botão de retry com focus", () => {
    const { container } = render(
      <ErrorState
        title="Erro com Focus"
        message="Teste de focus"
        onRetry={() => {}}
      />
    );

    const button = container.querySelector("button");
    button?.focus();

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "error-state-button-focus",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });

  test("botão de ação EmptyState com hover", () => {
    const { container } = render(
      <EmptyState
        icon={Users}
        title="Empty com Hover"
        description="Teste de hover"
        actionLabel="Criar"
        onAction={() => {}}
      />
    );

    const button = container.querySelector("button");
    button?.classList.add("hover");

    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "empty-state-button-hover",
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  });
});

describe("Visual Regression - Animações", () => {
  test("fade-in animation frames", async () => {
    const { container } = render(
      <div className="fade-in">
        <ErrorState title="Fade In" message="Teste" />
      </div>
    );

    // Frame inicial (opacity: 0)
    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "fade-in-frame-start",
    });

    // Aguarda animação
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Frame final (opacity: 1)
    expect(container.firstChild).toMatchImageSnapshot({
      customSnapshotIdentifier: "fade-in-frame-end",
      failureThreshold: 0.1,
      failureThresholdType: "percent",
    });
  });

  test("stagger-fade-in com múltiplos items", async () => {
    const { container } = render(
      <div className="stagger-fade-in">
        {[...Array(5)].map((_, i) => (
          <div key={i}>Item {i + 1}</div>
        ))}
      </div>
    );

    // Captura em diferentes momentos do stagger
    const frames = [0, 200, 400, 600];

    for (const delay of frames) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      expect(container.firstChild).toMatchImageSnapshot({
        customSnapshotIdentifier: `stagger-fade-in-frame-${delay}ms`,
        failureThreshold: 0.15,
        failureThresholdType: "percent",
      });
    }
  });
});
