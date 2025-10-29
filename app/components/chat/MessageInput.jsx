"use client";

import { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-default bg-surface"
    >
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          rows={1}
          className="
            flex-1
            resize-none
            border
            border-default
            bg-surface
            text-primary
            placeholder:text-tertiary
            rounded-lg
            px-4
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-accent
            disabled:bg-surface-muted
            disabled:cursor-not-allowed
          "
          style={{ minHeight: "42px", maxHeight: "120px" }}
          onInput={(e) => {
            e.target.style.height = "42px";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="
            px-6
            py-2
            bg-accent
            rounded-lg
            font-medium
            hover:bg-accent-strong
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition-colors
            duration-200
            flex-shrink-0
          "
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
