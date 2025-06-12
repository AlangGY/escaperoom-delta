"use client";

import { useState } from "react";
import { Message, useChatLLM } from "../hooks/useChatLLM";
import { useEscapeRoomGame } from "../hooks/useEscapeRoomGame";
import ChatBox from "../ui/ChatBox";
import EscapeRoomScene from "../ui/EscapeRoomScene";
import SynopsisOverlay from "../ui/SynopsisOverlay";

function getLastBotMessage(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === "bot") return messages[i].text;
  }
  return "당신인가. 이번엔 무슨 질문을 하러 왔지?";
}

export default function Home() {
  const [showSynopsis, setShowSynopsis] = useState(true);
  const chat = useChatLLM();
  const { messages, sendMessage, loading } = chat;
  const {
    isOpen,
    isWrong,
    isSolved,
    handleSend: handleGameSend,
    failAudioRef,
    openAudioRef,
  } = useEscapeRoomGame({ answer: "열쇠" });

  // ChatBox에서 전송 시 게임 로직과 LLM 전송을 함께 처리
  const handleSend = (text: string) => {
    const solved = handleGameSend(text, loading);
    if (solved) {
      sendMessage(text);
    }
  };

  // 로봇 말풍선 텍스트
  const balloonText = getLastBotMessage(messages);

  if (showSynopsis) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SynopsisOverlay onStart={() => setShowSynopsis(false)} />
      </div>
    );
  }

  return (
    <>
      <audio ref={failAudioRef} src="/fail.mp3" preload="auto" />
      <audio ref={openAudioRef} src="/open.mp3" preload="auto" />
      <div className="relative w-full h-screen min-h-screen overflow-hidden">
        {/* 3D 전체화면 */}
        <EscapeRoomScene
          isOpen={isOpen}
          isWrong={isWrong}
          balloonText={balloonText}
          onRobotClick={() => {}}
        />
        {/* 챗봇 대화창 항상 표시 */}
        <div className="fixed bottom-8 right-8 z-50 w-[360px] max-w-[90vw] overflow-hidden  bg-white rounded-xl shadow-xl flex flex-col border border-gray-200">
          <ChatBox
            messages={messages}
            sendMessage={handleSend}
            loading={loading}
            isSolved={isSolved}
            answer="열쇠"
            endingMessage="문이 열렸습니다! 축하합니다 🎉"
          />
        </div>
      </div>
    </>
  );
}
