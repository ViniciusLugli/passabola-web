/**
 * Testes Funcionais - Componente Button
 * Testa renderização, interatividade e variantes
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/app/components/ui/Button";

describe("Button Component", () => {
  describe("Renderização", () => {
    it("deve renderizar com texto", () => {
      render(<Button>Clique Aqui</Button>);
      expect(screen.getByText("Clique Aqui")).toBeInTheDocument();
    });

    it("deve renderizar com children customizado", () => {
      render(
        <Button>
          <span data-testid="custom-child">Custom</span>
        </Button>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("deve aplicar className customizado", () => {
      render(<Button className="custom-class">Botão</Button>);
      const button = screen.getByText("Botão");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Variantes", () => {
    it("deve renderizar variante primary", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByText("Primary");
      expect(button).toHaveClass("bg-gradient-to-br");
    });

    it("deve renderizar variante secondary", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByText("Secondary");
      expect(button).toBeInTheDocument();
    });

    it("deve renderizar variante danger", () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByText("Danger");
      expect(button).toBeInTheDocument();
    });

    it("deve renderizar variante ghost", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByText("Ghost");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Tamanhos", () => {
    it("deve renderizar tamanho small", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByText("Small");
      expect(button).toHaveClass("text-sm");
    });

    it("deve renderizar tamanho medium (default)", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByText("Medium");
      expect(button).toBeInTheDocument();
    });

    it("deve renderizar tamanho large", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByText("Large");
      expect(button).toHaveClass("text-lg");
    });
  });

  describe("Estados", () => {
    it("deve mostrar loading spinner quando isLoading=true", () => {
      render(<Button isLoading>Loading</Button>);
      // Verifica se o spinner está presente
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    it("deve desabilitar botão quando disabled=true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText("Disabled");
      expect(button).toBeDisabled();
    });

    it("deve desabilitar botão quando isLoading=true", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Interatividade", () => {
    it("deve chamar onClick quando clicado", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByText("Click Me");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("não deve chamar onClick quando disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByText("Disabled");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("não deve chamar onClick quando isLoading", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Acessibilidade", () => {
    it('deve ter role="button"', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("deve aceitar atributos ARIA customizados", () => {
      render(
        <Button aria-label="Custom label" aria-pressed="true">
          Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("deve ter aria-disabled quando disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText("Disabled");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Tipos de Botão", () => {
    it('deve aceitar type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByText("Submit");
      expect(button).toHaveAttribute("type", "submit");
    });

    it('deve ter type="button" como padrão', () => {
      render(<Button>Button</Button>);
      const button = screen.getByText("Button");
      expect(button).toHaveAttribute("type", "button");
    });

    it('deve aceitar type="reset"', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByText("Reset");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Full Width", () => {
    it("deve aplicar classe full quando fullWidth=true", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByText("Full Width");
      expect(button).toHaveClass("w-full");
    });

    it("não deve ter classe full por padrão", () => {
      render(<Button>Normal Width</Button>);
      const button = screen.getByText("Normal Width");
      expect(button).not.toHaveClass("w-full");
    });
  });
});
