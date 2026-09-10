'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export function AdvisorChatbot({
  initialProgram = 'Computer Science',
  initialCgpa = 8.0,
  initialGre,
}: {
  initialProgram?: string;
  initialCgpa?: number;
  initialGre?: number;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am your UniPath Admissions Guide & Advisor. You can ask me about university admission standards, paste any link/URL to inspect, or provide any Professor's or researcher's name and I will search the web to verify their affiliation, department, and active research.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAdvisor({
        query_text: query,
        user_cgpa: initialCgpa,
        user_gre: initialGre,
        target_program: initialProgram,
      });

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: res.answer,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: "I couldn't reach the advisor engine. Please make sure the backend server is running.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
          >
            <MessageSquare className="size-4" />
            <span>Ask Admissions Advisor</span>
          </button>
        ) : null}
      </div>

      {/* Chat modal window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[540px] w-[90vw] max-w-sm sm:max-w-md flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl backdrop-blur-xl animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-card/60 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-none">UniPath Advisor</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">Real-world admissions guidance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-foreground text-background font-medium'
                      : 'bg-muted/40 text-foreground border border-border/60'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Loader2 className="size-3.5 animate-spin" />
                </div>
                <span className="text-[11px]">Consulting admissions criteria…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-1.5 overflow-x-auto border-t bg-card/20 px-3 py-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setInput('Is Professor Fei-Fei Li part of Stanford University?');
              }}
              className="shrink-0 rounded-full border bg-muted/40 px-2.5 py-1 text-muted-foreground hover:text-foreground"
            >
              🔎 Verify Professor / Faculty?
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('https://cs.stanford.edu');
              }}
              className="shrink-0 rounded-full border bg-muted/40 px-2.5 py-1 text-muted-foreground hover:text-foreground"
            >
              🌐 Inspect link / URL
            </button>
            <button
              type="button"
              onClick={() => {
                setInput('How do I improve my resume for top universities?');
              }}
              className="shrink-0 rounded-full border bg-muted/40 px-2.5 py-1 text-muted-foreground hover:text-foreground"
            >
              💡 Improve resume?
            </button>
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3 bg-card/40">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, SOP, or eligibility…"
              className="flex-1 rounded-xl border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
