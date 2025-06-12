import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { useChatLLM } from "../hooks/useChatLLM";

interface ChatBoxProps {
  onClose?: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const { messages, sendMessage, loading } = useChatLLM();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div ref={boxRef} className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-white/80"
        ref={scrollRef}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "text-right" : "text-left"}
          >
            {msg.sender === "bot" ? (
              <span
                className="bg-gray-200 text-gray-800"
                style={{
                  borderRadius: 8,
                  padding: "6px 12px",
                  display: "inline-block",
                  maxWidth: 320,
                  textAlign: "left",
                }}
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
              ></span>
            ) : (
              <span
                className="bg-blue-100 text-blue-900"
                style={{
                  borderRadius: 8,
                  padding: "6px 12px",
                  display: "inline-block",
                  maxWidth: 220,
                }}
              >
                {msg.text}
              </span>
            )}
            {loading && i === messages.length - 1 && msg.sender === "bot" && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm text-black bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          disabled={loading}
          ref={inputRef}
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          onClick={handleSend}
          disabled={loading}
        >
          전송
        </button>
      </div>
    </div>
  );
}
