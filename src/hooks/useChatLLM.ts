import { useRef, useState } from "react";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

export function useChatLLM() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "당신인가. 이번엔 무슨 질문을 하러 왔지?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    const userMessages = [...messages, { sender: "user", text }];
    const openaiMessages = userMessages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    abortRef.current = new AbortController();

    let botMsg = "";
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: openaiMessages }),
      signal: abortRef.current.signal,
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        botMsg += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.sender === "bot") {
            return [...prev.slice(0, -1), { sender: "bot", text: botMsg }];
          }
          return prev;
        });
      }
    }
    setLoading(false);
  };

  const stop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return { messages, sendMessage, loading, stop };
}
