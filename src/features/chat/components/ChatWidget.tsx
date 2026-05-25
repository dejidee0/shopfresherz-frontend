"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { FiSend, FiMinus, FiX, FiMessageCircle } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { chatbotApi } from "@/lib/api/chatbot";
import { cn } from "@/lib/utils/format";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  text: "Hello! I'm Fresherz. Looking for anything specific today?",
  timestamp: new Date(),
};

function BotBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="max-w-[82%] bg-[#F5F0E8] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#111111] leading-relaxed">
        {message.text}
      </div>
      <span className="text-[10px] text-[#9CA3AF] ml-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}

function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[82%] bg-[#F5820A] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed">
        {message.text}
      </div>
      <span className="text-[10px] text-[#9CA3AF] mr-1">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 max-w-[60%]">
      <div className="bg-[#F5F0E8] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [quickReplies, setQuickReplies] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) setHasUnread(true);
  }, [messages, isOpen]);

  // Lock body scroll on mobile when chat is open full-screen
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isOpen && !isMinimized && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMinimized]);

  function open() {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  }

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isLoading) return;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setQuickReplies([]);
      setIsLoading(true);

      try {
        const data = await chatbotApi.sendMessage({
          message: text,
          conversationId,
        });
        const botMsg: Message = {
          id: uid(),
          role: "assistant",
          text: data.reply,
          timestamp: new Date(),
        };
        setConversationId(data.conversationId);
        setQuickReplies(data.quickReplies ?? []);
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            text: "Sorry, I'm having trouble connecting right now. Please try again or call us at +234 907 530 8722.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, input, isLoading],
  );

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  }

  return (
    <>
      {/* ── FAB trigger ── */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#F5820A] text-white shadow-lg hover:shadow-orange-300 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat with Fresherz"
        >
          <FiMessageCircle size={22} />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {isOpen && (
        <>
          {/*
            Mobile  : full-screen overlay (inset-0), sheet slides up from bottom
            Desktop : fixed panel bottom-right, fixed width + height
          */}
          <div
            className={cn(
              "fixed z-50 flex flex-col bg-white overflow-hidden transition-all duration-300",

              // ── Mobile: full viewport sheet ──
              "inset-0",

              // ── sm+: floating panel pinned bottom-right ──
              "sm:inset-auto sm:bottom-6 sm:right-6",
              "sm:w-97.5 sm:rounded-[20px] sm:shadow-2xl sm:shadow-black/20",
              isMinimized ? "sm:h-16" : "sm:h-145",
            )}
            role="dialog"
            aria-label="Chat with Fresherz"
            aria-modal="true"
          >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F5F5F5] shrink-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <RiRobot2Line size={20} className="text-[#F5820A]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#111111] leading-none">
                  ShopFresherz
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5 uppercase tracking-wider">
                  Online
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Minimize hidden on mobile — full-screen has no "minimized" state */}
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <FiMinus size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
                  aria-label="Close chat"
                >
                  <FiX size={17} />
                </button>
              </div>
            </div>

            {/* ── Body (hidden when minimized on desktop) ── */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                  {messages.map((msg) =>
                    msg.role === "assistant" ? (
                      <BotBubble key={msg.id} message={msg} />
                    ) : (
                      <UserBubble key={msg.id} message={msg} />
                    ),
                  )}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                {quickReplies.length > 0 && !isLoading && (
                  <div className="flex gap-2 overflow-x-auto px-4 py-3 border-t border-[#F5F5F5] bg-white shrink-0 scrollbar-hide">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => sendMessage(reply)}
                        className="shrink-0 rounded-full border border-[#F5820A]/30 bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#B45309] hover:border-[#F5820A] hover:bg-[#FFEDD5] transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input — safe area padding on mobile for home indicator */}
                <div className="flex items-end gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3 border-t border-[#F5F5F5] bg-white shrink-0">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 resize-none text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none bg-transparent leading-relaxed max-h-25 overflow-y-auto disabled:opacity-60"
                    aria-label="Chat input"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-full bg-[#F5820A] text-white shrink-0 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    aria-label="Send message"
                  >
                    <FiSend size={16} className="-translate-x-px" />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
