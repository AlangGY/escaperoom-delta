import { useEffect, useRef, useState } from "react";
import { Message } from "../hooks/useChatLLM";

interface ChatBoxProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  loading: boolean;
  isSolved: boolean;
  answer?: string; // 정답 단어
  endingMessage?: string; // 엔딩 메시지
}

export default function ChatBox({
  messages,
  sendMessage,
  loading,
  isSolved,
}: ChatBoxProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!loading && !isSolved) {
      inputRef.current?.focus();
    }
  }, [loading, isSolved]);

  const handleSend = () => {
    if (!input.trim() || loading || isSolved) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div ref={boxRef} className="flex flex-col h-full">
      {/* <div
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
      </div> */}
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm text-black bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isSolved ? "정답을 맞췄습니다!" : "메시지를 입력하세요"}
          disabled={loading || isSolved}
          ref={inputRef}
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          onClick={handleSend}
          disabled={loading || isSolved}
        >
          전송
        </button>
      </div>
    </div>
  );
}
