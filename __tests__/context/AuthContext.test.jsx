/**
 * Testes Funcionais - AuthContext
 * Testa provider, hook e funcionalidades de autenticação
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";

// Componente de teste que usa o hook useAuth
const TestComponent = () => {
  const { user, loading, login, logout, register } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? "loading" : "not-loading"}</div>
      <div data-testid="user">{user ? user.name : "no-user"}</div>
      <button
        onClick={() => login({ email: "test@test.com", password: "123" })}
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <button
        onClick={() => register({ name: "Test", email: "test@test.com" })}
      >
        Register
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    vi.clearAllMocks();

    // Mock do fetch
    global.fetch = vi.fn();
  });

  describe("Provider e Hook", () => {
    it("deve renderizar children corretamente", () => {
      render(
        <AuthProvider>
          <div data-testid="child">Child Component</div>
        </AuthProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("deve fornecer valores iniciais corretos", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      expect(screen.getByTestId("user")).toHaveTextContent("no-user");
    });

    it("deve lançar erro quando useAuth usado fora do Provider", () => {
      // Suprime erro do console para este teste
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      spy.mockRestore();
    });
  });

  describe("Login", () => {
    it("deve fazer login com sucesso", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@test.com" };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: "fake-token" }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText("Login");
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("Test User");
      });

      // Verifica se o token foi salvo no localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-token");
    });

    it("deve mostrar loading durante login", async () => {
      global.fetch.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText("Login");
      act(() => {
        loginButton.click();
      });

      expect(screen.getByTestId("loading")).toHaveTextContent("loading");

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });
    });

    it("deve lidar com erro de login", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Login failed"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText("Login");
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("no-user");
        expect(screen.getByTestId("loading")).toHaveTextContent("not-loading");
      });
    });
  });

  describe("Logout", () => {
    it("deve fazer logout corretamente", async () => {
      const mockUser = { id: 1, name: "Test User" };

      // Mock login bem-sucedido
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: "fake-token" }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Faz login
      const loginButton = screen.getByText("Login");
      act(() => {
        loginButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("Test User");
      });

      // Faz logout
      const logoutButton = screen.getByText("Logout");
      act(() => {
        logoutButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("no-user");
      });

      // Verifica se o token foi removido do localStorage
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    });
  });

  describe("Register", () => {
    it("deve registrar novo usuário com sucesso", async () => {
      const mockUser = { id: 1, name: "New User", email: "new@test.com" };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: "new-token" }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const registerButton = screen.getByText("Register");
      act(() => {
        registerButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("New User");
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("token", "new-token");
    });

    it("deve lidar com erro de registro", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Registration failed"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const registerButton = screen.getByText("Register");
      act(() => {
        registerButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("no-user");
      });
    });
  });

  describe("Persistência de Sessão", () => {
    it("deve recuperar usuário do localStorage na montagem", async () => {
      const mockUser = { id: 1, name: "Persisted User" };

      localStorage.setItem("token", "stored-token");
      localStorage.setItem("user", JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("Persisted User");
      });
    });

    it("deve validar token ao carregar", async () => {
      localStorage.setItem("token", "stored-token");

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, name: "Validated User" } }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/auth/validate"),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: "Bearer stored-token",
            }),
          })
        );
      });
    });

    it("deve fazer logout se token inválido", async () => {
      localStorage.setItem("token", "invalid-token");

      global.fetch.mockRejectedValueOnce(new Error("Invalid token"));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("user")).toHaveTextContent("no-user");
        expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      });
    });
  });
});
