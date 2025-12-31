"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useState, useRef, useEffect } from "react";
import { Send, BarChart3, User, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function DataAnalyzerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Generate or retrieve session ID
      let sessionId = localStorage.getItem("data_analyzer_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("data_analyzer_session_id", sessionId);
      }

      const res = await fetch("/api/data-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      if (!res.ok) throw new Error("Failed to analyze data");

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I could not analyze the data.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Data Analyzer
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-center">
              <BarChart3 className="h-12 w-12 mb-2 opacity-20" />
              <p>Paste your data here (CSV, JSON, Text) and I'll analyze it for you.</p>
              <p className="text-sm mt-2 opacity-60">Try pasting a small CSV of sales data.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 dark:bg-purple-900/50">
                   <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
               {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0 dark:bg-zinc-700">
                   <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
              )}
            </div>
          ))}
           {isLoading && (
              <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 dark:bg-purple-900/50">
                   <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-2">
                   <span className="animate-pulse">Analyzing...</span>
                </div>
              </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
             {/* Note: File upload would require more logic to read file content, sticking to text input for MVP */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste data or ask questions..."
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
