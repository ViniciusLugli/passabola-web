"use client";

import { useState, useRef, useEffect } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      const response = await fetch("http://chatbot:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Erro ao comunicar com o chatbot:", error);
      const errorMessage = {
        sender: "bot",
        text: "Desculpe, não consegui me conectar ao chatbot.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-page">
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Chatbot
        </h1>
        <div className="flex-1 overflow-y-auto p-4 bg-surface border border-default rounded-lg shadow-elevated mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg max-w-[70%] text-sm ${
                msg.sender === "user"
                  ? "bg-accent text-on-brand self-end ml-auto shadow-elevated"
                  : "bg-surface-muted border border-default text-primary self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            name="chatInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" className="px-5">
            Enviar
          </Button>
        </form>
      </main>
    </div>
  );
}
