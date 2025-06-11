import { useEffect, useRef, useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const initialMessages: Message[] = [
  { sender: "bot", text: "안녕하세요! 델타 AI입니다. 궁금한 점을 물어보세요." },
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "(목업) 답변입니다: " + input },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-white/80"
        ref={scrollRef}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "text-right" : "text-left"}
          >
            <span
              className={
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-200 text-gray-800"
              }
              style={{
                borderRadius: 8,
                padding: "6px 12px",
                display: "inline-block",
                maxWidth: 220,
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
}
