import { useRef, useState } from "react";

interface UseEscapeRoomGameOptions {
  answer?: string;
  endingMessage?: string;
  onSolved?: () => void;
}

export function useEscapeRoomGame(options: UseEscapeRoomGameOptions = {}) {
  const answer = options.answer ?? "열쇠";
  const [isOpen, setIsOpen] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const failAudioRef = useRef<HTMLAudioElement>(null);
  const openAudioRef = useRef<HTMLAudioElement>(null);

  // 정답 체크 및 문 열림 처리
  const handleSend = (text: string, loading: boolean) => {
    if (!text.trim() || loading || isSolved) return false;
    if (text.trim() === answer) {
      setIsSolved(true);
      setIsOpen(true);
      if (openAudioRef.current) {
        openAudioRef.current.currentTime = 0;
        openAudioRef.current.play();
      }
      if (options.onSolved) options.onSolved();
    } else {
      setIsWrong(true);
      if (failAudioRef.current) {
        failAudioRef.current.currentTime = 0;
        failAudioRef.current.play();
      }
      setTimeout(() => setIsWrong(false), 700);
    }
    return true;
  };

  return {
    isOpen,
    setIsOpen,
    isWrong,
    setIsWrong,
    isSolved,
    setIsSolved,
    handleSend,
    failAudioRef,
    openAudioRef,
  };
}
