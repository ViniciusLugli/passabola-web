/**
 * MessageBubble Component Tests
 *
 * Tests for message bubble improvements including:
 * - Enhanced padding and shadows
 * - Delivery status indicators
 * - Read receipts
 * - Responsive design
 */

import { render, screen } from "@testing-library/react";
import MessageBubble from "@/app/components/chat/MessageBubble";
import { useAuth } from "@/app/context/AuthContext";

jest.mock("@/app/context/AuthContext");

describe("MessageBubble - Styling", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  test("own messages have enhanced shadow", () => {
    const message = {
      id: "msg-1",
      content: "Test message",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Test message").closest("div");
    expect(bubble.className).toContain("shadow-md");
    expect(bubble.className).toContain("hover:shadow-lg");
  });

  test("messages have minimum height of 48px", () => {
    const message = {
      id: "msg-1",
      content: "Hi",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Hi").closest("div");
    expect(bubble.className).toContain("min-h-[48px]");
  });

  test("messages use rounded-2xl for corners", () => {
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Test").closest("div");
    expect(bubble.className).toContain("rounded-2xl");
  });

  test("messages have increased padding", () => {
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Test").closest("div");
    expect(bubble.className).toContain("px-4");
    expect(bubble.className).toContain("py-3");
  });

  test("other user messages have hover border effect", () => {
    const message = {
      id: "msg-1",
      content: "Hello",
      senderId: "user-2",
      senderName: "Other User",
      sentAt: new Date().toISOString(),
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Hello").closest("div");
    expect(bubble.className).toContain("hover:border-accent/30");
  });
});

describe("MessageBubble - Delivery Status", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  test("shows single check mark for sent messages", () => {
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    const { container } = render(<MessageBubble message={message} />);

    // Check for SVG check mark
    const checkMark = container.querySelector("svg");
    expect(checkMark).toBeInTheDocument();
  });

  test("shows double check mark for read messages", () => {
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
      isRead: true,
    };

    const { container } = render(<MessageBubble message={message} />);

    // Check for double check mark (two paths in SVG)
    const svgElement = container.querySelector("svg");
    const paths = svgElement.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

  test("does not show status for other user messages", () => {
    const message = {
      id: "msg-1",
      content: "Hello",
      senderId: "user-2",
      senderName: "Other User",
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    const { container } = render(<MessageBubble message={message} />);

    // Should not have delivery status SVG
    const messageBubble = screen.getByText("Hello").closest("div");
    const statusSvg = messageBubble.querySelector("svg");
    expect(statusSvg).toBeNull();
  });
});

describe("MessageBubble - Content Display", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  test("displays message content with proper line height", () => {
    const message = {
      id: "msg-1",
      content: "Test message content",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    render(<MessageBubble message={message} />);

    const content = screen.getByText("Test message content");
    expect(content.className).toContain("leading-relaxed");
  });

  test("shows sender name for other user messages", () => {
    const message = {
      id: "msg-1",
      content: "Hello",
      senderId: "user-2",
      senderName: "Jane Doe",
      sentAt: new Date().toISOString(),
    };

    render(<MessageBubble message={message} />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  test("does not show sender name for own messages", () => {
    const message = {
      id: "msg-1",
      content: "My message",
      senderId: "user-1",
      senderName: "Test User",
      sentAt: new Date().toISOString(),
    };

    render(<MessageBubble message={message} />);

    // Sender name should not be visible for own messages
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });

  test("formats time correctly", () => {
    const now = new Date();
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: now.toISOString(),
    };

    render(<MessageBubble message={message} />);

    // Check that time is displayed (format: HH:MM)
    const timeElement = screen.getByText(/\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});

describe("MessageBubble - Responsive Design", () => {
  const mockUser = {
    id: "user-1",
    name: "Test User",
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  test("message bubble has max width of 70%", () => {
    const message = {
      id: "msg-1",
      content: "Test",
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    const { container } = render(<MessageBubble message={message} />);

    const bubble = screen.getByText("Test").closest("div");
    expect(bubble.className).toContain("max-w-[70%]");
  });

  test("handles long text with proper wrapping", () => {
    const longText =
      "This is a very long message that should wrap properly across multiple lines without breaking the layout";

    const message = {
      id: "msg-1",
      content: longText,
      senderId: "user-1",
      sentAt: new Date().toISOString(),
    };

    render(<MessageBubble message={message} />);

    const content = screen.getByText(longText);
    expect(content.className).toContain("break-words");
    expect(content.className).toContain("whitespace-pre-wrap");
  });
});
