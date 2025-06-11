"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const Door3D = dynamic(() => import("./ui/Door3D"), { ssr: false });
const ChatBot = dynamic(() => import("./ui/ChatBot"), { ssr: false });

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showEnding, setShowEnding] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const failAudioRef = useRef<HTMLAudioElement>(null);
  const openAudioRef = useRef<HTMLAudioElement>(null);

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer === "열쇠") {
      setIsOpen(true);
      if (openAudioRef.current) {
        openAudioRef.current.currentTime = 0;
        openAudioRef.current.play();
      }
      setTimeout(() => setShowEnding(true), 1500);
    } else {
      setIsWrong(true);
      if (failAudioRef.current) {
        failAudioRef.current.currentTime = 0;
        failAudioRef.current.play();
      }
      setTimeout(() => setIsWrong(false), 700);
    }
  };

  return (
    <>
      <audio ref={failAudioRef} src="/fail.mp3" preload="auto" />
      <audio ref={openAudioRef} src="/open.mp3" preload="auto" />
      <div className="w-full h-screen flex">
        {/* 챗봇 UI (좌측 고정) */}
        <div className="w-[340px] min-w-[240px] h-full border-r border-gray-200 bg-white/80 z-10">
          <ChatBot />
        </div>
        {/* 메인 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-[320px] h-[420px] flex items-center justify-center">
            <Door3D isOpen={isOpen} isWrong={isWrong} />
          </div>
          {!showEnding ? (
            <form onSubmit={handleAnswer} className="mt-8 flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="정답을 입력하세요"
                className="border rounded px-4 py-2 text-lg"
                disabled={isOpen}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-lg"
                disabled={isOpen}
              >
                제출
              </button>
            </form>
          ) : (
            <div className="mt-8 text-2xl font-bold text-green-700">
              문이 열렸습니다! 축하합니다 🎉
            </div>
          )}
        </div>
      </div>
    </>
  );
}
