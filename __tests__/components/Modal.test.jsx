/**
 * Testes Funcionais - Componente Modal
 * Testa abertura, fechamento e acessibilidade
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modal from "@/app/components/ui/Modal";

describe("Modal Component", () => {
  describe("Renderização", () => {
    it("não deve renderizar quando isOpen=false", () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("deve renderizar quando isOpen=true", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText("Test Modal")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("deve renderizar título customizado", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Custom Title">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("deve renderizar children", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <div data-testid="custom-content">
            <p>Parágrafo 1</p>
            <p>Parágrafo 2</p>
          </div>
        </Modal>
      );

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Parágrafo 1")).toBeInTheDocument();
      expect(screen.getByText("Parágrafo 2")).toBeInTheDocument();
    });
  });

  describe("Fechamento", () => {
    it("deve chamar onClose ao clicar no botão X", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByRole("button", { name: /fechar/i });
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onClose ao clicar no overlay", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const overlay = screen.getByTestId("modal-overlay");
      fireEvent.click(overlay);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onClose ao pressionar Escape", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Modal">
          <p>Content</p>
        </Modal>
      );

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("não deve chamar onClose ao clicar no conteúdo do modal", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const content = screen.getByText("Content");
      fireEvent.click(content);

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe("Acessibilidade", () => {
    it('deve ter role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it('deve ter aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    it("deve ter aria-labelledby apontando para o título", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Title">
          <p>Content</p>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      const title = screen.getByText("Test Title");

      expect(dialog).toHaveAttribute("aria-labelledby", title.id);
    });

    it("botão de fechar deve ter aria-label", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByRole("button", { name: /fechar/i });
      expect(closeButton).toHaveAttribute("aria-label");
    });
  });

  describe("Focus Management", () => {
    it("deve focar no modal quando aberto", async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <button>Focusable Button</button>
        </Modal>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(document.activeElement).toBe(dialog);
      });
    });

    it("deve retornar foco ao elemento anterior quando fechado", async () => {
      const handleClose = vi.fn();
      const { rerender } = render(
        <>
          <button data-testid="trigger">Open Modal</button>
          <Modal isOpen={false} onClose={handleClose} title="Modal">
            <p>Content</p>
          </Modal>
        </>
      );

      const trigger = screen.getByTestId("trigger");
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      // Abre modal
      rerender(
        <>
          <button data-testid="trigger">Open Modal</button>
          <Modal isOpen={true} onClose={handleClose} title="Modal">
            <p>Content</p>
          </Modal>
        </>
      );

      await waitFor(() => {
        expect(document.activeElement).not.toBe(trigger);
      });

      // Fecha modal
      rerender(
        <>
          <button data-testid="trigger">Open Modal</button>
          <Modal isOpen={false} onClose={handleClose} title="Modal">
            <p>Content</p>
          </Modal>
        </>
      );

      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });
  });

  describe("Prevenção de Scroll", () => {
    it("deve adicionar overflow-hidden ao body quando aberto", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("deve remover overflow-hidden ao body quando fechado", () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <Modal isOpen={false} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Animações", () => {
    it("deve ter classes de animação", () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          <p>Content</p>
        </Modal>
      );

      const overlay = screen.getByTestId("modal-overlay");
      expect(overlay).toHaveClass("fade-in");
    });
  });
});
