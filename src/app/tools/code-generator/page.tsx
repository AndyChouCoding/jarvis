"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useState, useRef, useEffect } from "react";
import { Send, Code2, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
// We might want to add a syntax highlighter later, but for now simple markdown is okay.
// Or we can use `react-syntax-highlighter` if we were to install it, but sticking to standard deps for now.

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CodeGeneratorPage() {
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
      let sessionId = localStorage.getItem("code_gen_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("code_gen_session_id", sessionId);
      }

      const res = await fetch("/api/code-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      if (!res.ok) throw new Error("Failed to generate code");

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I could not generate the code.",
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
  
  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors" title="Copy code">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-zinc-500" />}
        </button>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-6xl mx-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-600" />
            Code Generator
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-center">
              <Code2 className="h-12 w-12 mb-2 opacity-20" />
              <p>Describe the code you need, and I'll generate it for you.</p>
              <p className="text-sm mt-2 opacity-60">Try: "Create a Python script to sort a list of dictionaries"</p>
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
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 dark:bg-emerald-900/50">
                   <Code2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-3 max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 w-full"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                  <ReactMarkdown
                    components={{
                        pre: ({node, ...props}) => (
                            <div className="relative group">
                                <pre {...props} className="overflow-x-auto p-4 rounded-md bg-zinc-800 text-zinc-100 my-2" />
                            </div>
                        ),
                        code: ({node, ...props}) => (
                             <code {...props} className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5" />
                        )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
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
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 dark:bg-emerald-900/50">
                   <Code2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-2">
                   <span className="animate-pulse">Generating code...</span>
                </div>
              </div>
           )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the code to generate..."
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
