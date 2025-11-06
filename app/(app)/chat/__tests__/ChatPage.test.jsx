/**
 * Chat Page Tests
 *
 * Test suite for chat functionality including:
 * - 2-column layout on desktop
 * - Mobile navigation with transitions
 * - Message sending and display
 * - Accessibility features
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatPage from "@/app/(app)/chat/page";
import { useAuth } from "@/app/context/AuthContext";
import { useChat } from "@/app/context/ChatContext";

// Mock contexts
jest.mock("@/app/context/AuthContext");
jest.mock("@/app/context/ChatContext");
jest.mock("@/app/context/ToastContext", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("ChatPage - Desktop Layout", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
    username: "testuser",
  };

  const mockConversations = [
    {
      otherUserId: "user-2",
      otherName: "John Doe",
      otherUsername: "johndoe",
      lastMessage: "Hello there!",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useChat.mockReturnValue({
      conversations: mockConversations,
      setConversations: jest.fn(),
      activeConversation: null,
      setActiveConversation: jest.fn(),
      messages: {},
      isConnected: true,
      subscribeToChat: jest.fn(),
      unsubscribeFromChat: jest.fn(),
      sendMessageViaWebSocket: jest.fn(),
      addMessageLocally: jest.fn(),
      setConversationMessages: jest.fn(),
    });
  });

  test("renders 2-column layout on desktop", () => {
    // Set viewport to desktop size
    global.innerWidth = 1024;

    render(<ChatPage />);

    // Check if conversations list is visible
    expect(screen.getByText("Conversas")).toBeInTheDocument();

    // Check if conversation item is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("shows online indicator for active users", () => {
    render(<ChatPage />);

    // Check for online indicator (green dot via bg-green-500 class)
    const conversationItem = screen.getByText("John Doe").closest("div");
    const onlineIndicator = conversationItem.querySelector(".bg-green-500");

    expect(onlineIndicator).toBeInTheDocument();
  });

  test("displays unread message count", () => {
    render(<ChatPage />);

    // Check for unread count badge
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("ChatPage - Mobile Navigation", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  const mockActiveConversation = {
    otherUserId: "user-2",
    otherName: "Jane Smith",
    otherUsername: "janesmith",
  };

  beforeEach(() => {
    // Set viewport to mobile size
    global.innerWidth = 375;

    useAuth.mockReturnValue({ user: mockUser });
    useChat.mockReturnValue({
      conversations: [],
      setConversations: jest.fn(),
      activeConversation: mockActiveConversation,
      setActiveConversation: jest.fn(),
      messages: { "user-2": [] },
      isConnected: true,
      subscribeToChat: jest.fn(),
      unsubscribeFromChat: jest.fn(),
      sendMessageViaWebSocket: jest.fn(),
      addMessageLocally: jest.fn(),
      setConversationMessages: jest.fn(),
    });
  });

  test("shows back button on mobile when conversation is active", () => {
    render(<ChatPage />);

    // Check for back button
    const backButton = screen.getByLabelText("Voltar para conversas");
    expect(backButton).toBeInTheDocument();
  });

  test("back button has minimum touch target size", () => {
    render(<ChatPage />);

    const backButton = screen.getByLabelText("Voltar para conversas");

    // Check for min-w-[44px] and min-h-[44px] classes
    expect(backButton.className).toContain("min-w-[44px]");
    expect(backButton.className).toContain("min-h-[44px]");
  });

  test("transition classes are applied for smooth animations", () => {
    const { container } = render(<ChatPage />);

    // Check for transition classes
    const messageArea = container.querySelector(".transition-all");
    expect(messageArea).toBeInTheDocument();
  });
});

describe("ChatPage - Message Display", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  const mockMessages = [
    {
      id: "msg-1",
      content: "Hello!",
      senderId: "user-2",
      senderName: "Jane",
      sentAt: new Date().toISOString(),
      isRead: false,
    },
    {
      id: "msg-2",
      content: "Hi there!",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
      isRead: true,
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useChat.mockReturnValue({
      conversations: [],
      setConversations: jest.fn(),
      activeConversation: {
        otherUserId: "user-2",
        otherName: "Jane",
      },
      setActiveConversation: jest.fn(),
      messages: { "user-2": mockMessages },
      isConnected: true,
      subscribeToChat: jest.fn(),
      unsubscribeFromChat: jest.fn(),
      sendMessageViaWebSocket: jest.fn(),
      addMessageLocally: jest.fn(),
      setConversationMessages: jest.fn(),
    });
  });

  test("displays message bubbles with proper styling", () => {
    render(<ChatPage />);

    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  test("shows read status for own messages", () => {
    const { container } = render(<ChatPage />);

    // Check for read indicator (double check mark)
    const ownMessageBubble = screen.getByText("Hi there!").closest("div");
    const readIndicator = ownMessageBubble.querySelector("svg");

    expect(readIndicator).toBeInTheDocument();
  });
});

describe("ChatPage - Accessibility", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    useChat.mockReturnValue({
      conversations: [
        {
          otherUserId: "user-2",
          otherName: "Test Conversation",
        },
      ],
      setConversations: jest.fn(),
      activeConversation: null,
      setActiveConversation: jest.fn(),
      messages: {},
      isConnected: true,
      subscribeToChat: jest.fn(),
      unsubscribeFromChat: jest.fn(),
      sendMessageViaWebSocket: jest.fn(),
      addMessageLocally: jest.fn(),
      setConversationMessages: jest.fn(),
    });
  });

  test("conversation items are keyboard accessible", () => {
    render(<ChatPage />);

    const conversationItem = screen
      .getByText("Test Conversation")
      .closest("div");

    // Check for role="button"
    expect(conversationItem).toHaveAttribute("role", "button");

    // Check for tabIndex
    expect(conversationItem).toHaveAttribute("tabIndex", "0");
  });

  test("back button has proper aria-label", () => {
    useChat.mockReturnValue({
      conversations: [],
      setConversations: jest.fn(),
      activeConversation: {
        otherUserId: "user-2",
        otherName: "Test User",
      },
      setActiveConversation: jest.fn(),
      messages: { "user-2": [] },
      isConnected: true,
      subscribeToChat: jest.fn(),
      unsubscribeFromChat: jest.fn(),
      sendMessageViaWebSocket: jest.fn(),
      addMessageLocally: jest.fn(),
      setConversationMessages: jest.fn(),
    });

    render(<ChatPage />);

    const backButton = screen.getByLabelText("Voltar para conversas");
    expect(backButton).toHaveAttribute("aria-label");
  });
});

describe("ChatPage - Responsive Behavior", () => {
  test("applies correct grid layout for desktop", () => {
    const { container } = render(<ChatPage />);

    // Check for grid layout class
    const chatContainer = container.querySelector(".grid");
    expect(chatContainer).toHaveClass("md:grid-cols-[320px_1fr]");
  });

  test("conversation list width is 320px on desktop", () => {
    const { container } = render(<ChatPage />);

    // Check for 320px width in grid template
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer.className).toContain("md:grid-cols-[320px_1fr]");
  });
});
