/**
 * Chatbot Page Tests
 *
 * Test suite for chatbot functionality including:
 * - Bot avatar and identity
 * - Quick reply buttons
 * - Welcome message
 * - Message styling differentiation
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatbotPage from "@/app/(app)/chatbot/page";

// Mock fetch for chatbot API
global.fetch = jest.fn();

describe("ChatbotPage - Bot Identity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays bot avatar and name in header", () => {
    render(<ChatbotPage />);

    expect(screen.getByText("Assistente PassaBola")).toBeInTheDocument();
    expect(screen.getByText("Sempre pronto para ajudar")).toBeInTheDocument();

    // Check for robot emoji
    const header = screen.getByText("Assistente PassaBola").closest("div");
    expect(header.textContent).toContain("🤖");
  });

  test("shows welcome message on initial load", () => {
    render(<ChatbotPage />);

    expect(
      screen.getByText(/Olá! Sou o Assistente PassaBola/)
    ).toBeInTheDocument();
  });

  test("bot messages have distinct styling", () => {
    render(<ChatbotPage />);

    const welcomeMessage = screen
      .getByText(/Olá! Sou o Assistente PassaBola/)
      .closest("div");

    // Check for gradient background classes
    expect(welcomeMessage.className).toContain("from-purple-50");
    expect(welcomeMessage.className).toContain("to-blue-50");
  });

  test("bot messages include bot avatar", () => {
    const { container } = render(<ChatbotPage />);

    // Check for bot avatar with robot emoji
    const botAvatars = container.querySelectorAll(
      ".from-purple-500.to-blue-500"
    );
    expect(botAvatars.length).toBeGreaterThan(0);
  });
});

describe("ChatbotPage - Quick Replies", () => {
  test("displays quick reply buttons on initial load", () => {
    render(<ChatbotPage />);

    expect(screen.getByText("Sugestões rápidas:")).toBeInTheDocument();
    expect(screen.getByText("Como criar um time?")).toBeInTheDocument();
    expect(screen.getByText("Como encontrar jogos?")).toBeInTheDocument();
    expect(screen.getByText("Como funciona o ranking?")).toBeInTheDocument();
    expect(screen.getByText("Ajuda com o perfil")).toBeInTheDocument();
  });

  test("quick reply buttons are clickable", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Resposta do bot" }),
    });

    render(<ChatbotPage />);

    const quickReplyButton = screen.getByText("Como criar um time?");
    await user.click(quickReplyButton);

    // Check if message was sent
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://chatbot:5000/chat",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ message: "Como criar um time?" }),
        })
      );
    });
  });

  test("quick replies disappear after first user message", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    });

    render(<ChatbotPage />);

    // Initially present
    expect(screen.getByText("Sugestões rápidas:")).toBeInTheDocument();

    // Send a message
    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    const sendButton = screen.getByText("Enviar");

    await user.type(input, "Test message");
    await user.click(sendButton);

    // Wait for state update - quick replies should be hidden
    await waitFor(() => {
      expect(screen.queryByText("Sugestões rápidas:")).not.toBeInTheDocument();
    });
  });
});

describe("ChatbotPage - Message Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sends message when form is submitted", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    });

    render(<ChatbotPage />);

    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    const sendButton = screen.getByText("Enviar");

    await user.type(input, "Hello bot");
    await user.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://chatbot:5000/chat",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: "Hello bot" }),
        })
      );
    });
  });

  test("displays bot response after sending message", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response here" }),
    });

    render(<ChatbotPage />);

    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    await user.type(input, "Test");

    const sendButton = screen.getByText("Enviar");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Bot response here")).toBeInTheDocument();
    });
  });

  test("handles error when chatbot connection fails", async () => {
    const user = userEvent.setup();

    fetch.mockRejectedValueOnce(new Error("Connection failed"));

    render(<ChatbotPage />);

    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    await user.type(input, "Test");

    const sendButton = screen.getByText("Enviar");
    await user.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Desculpe, não consegui me conectar ao chatbot/)
      ).toBeInTheDocument();
    });
  });

  test("clears input after sending message", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Response" }),
    });

    render(<ChatbotPage />);

    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    await user.type(input, "Test message");

    expect(input).toHaveValue("Test message");

    const sendButton = screen.getByText("Enviar");
    await user.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});

describe("ChatbotPage - Accessibility", () => {
  test("message bubbles have minimum height for touch", () => {
    const { container } = render(<ChatbotPage />);

    const messageBubbles = container.querySelectorAll(".min-h-\\[48px\\]");
    expect(messageBubbles.length).toBeGreaterThan(0);
  });

  test("input has proper placeholder", () => {
    render(<ChatbotPage />);

    const input = screen.getByPlaceholderText("Digite sua mensagem...");
    expect(input).toBeInTheDocument();
  });

  test("bot name is clearly identified in messages", () => {
    render(<ChatbotPage />);

    // Check for bot name label in message
    expect(screen.getByText("Assistente PassaBola")).toBeInTheDocument();
  });
});

describe("ChatbotPage - Visual Design", () => {
  test("header uses gradient background for bot avatar", () => {
    const { container } = render(<ChatbotPage />);

    const botAvatar = container.querySelector(".from-purple-500.to-blue-500");
    expect(botAvatar).toBeInTheDocument();
  });

  test("quick reply buttons have hover states", () => {
    render(<ChatbotPage />);

    const quickReplyButton = screen.getByText("Como criar um time?");

    // Check for hover classes
    expect(quickReplyButton.className).toContain("hover:bg-accent");
    expect(quickReplyButton.className).toContain("hover:text-on-brand");
  });

  test("messages use proper border radius", () => {
    const { container } = render(<ChatbotPage />);

    const messageBubbles = container.querySelectorAll(".rounded-2xl");
    expect(messageBubbles.length).toBeGreaterThan(0);
  });
});
