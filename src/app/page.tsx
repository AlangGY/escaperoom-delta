"use client";

import Door3D from "@/ui/Door3D";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Message } from "../hooks/useChatLLM";
import ChatBox from "../ui/ChatBox";
import Robot3D from "../ui/Robot3D";
import SynopsisOverlay from "../ui/SynopsisOverlay";

function getLastBotMessage(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === "bot") return messages[i].text;
  }
  return "당신인가. 이번엔 무슨 질문을 하러 왔지?";
}

type ThreeSceneProps = {
  isOpen: boolean;
  isWrong: boolean;
  balloonText: string;
  onRobotClick: () => void;
};
function ThreeScene({
  isOpen,
  isWrong,
  balloonText,
  onRobotClick,
}: ThreeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 7], fov: 50 }}
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(#23272e, #444b58)",
      }}
      shadows
    >
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[0, 8, 0]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#eaeaea"
      />
      <spotLight
        position={[0, 4, 0]}
        angle={0.4}
        penumbra={0.2}
        intensity={900}
        distance={10}
        color="#fffbe6"
        castShadow
        target-position={[0, -1.2, 2]}
      />
      {/* 바닥 */}
      <mesh
        receiveShadow
        position={[0, -2.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#23272e" />
      </mesh>
      {/* 왼쪽 벽 */}
      <mesh receiveShadow position={[-3.5, 1, -1.8]}>
        <planeGeometry args={[5, 8]} />
        <meshStandardMaterial color="#2d313a" />
      </mesh>
      {/* 문 위쪽 벽 */}
      <mesh receiveShadow position={[0, 3.5, -1.8]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#2d313a" />
      </mesh>
      {/* 오른쪽 벽 */}
      <mesh receiveShadow position={[3.5, 1, -1.8]}>
        <planeGeometry args={[5, 8]} />
        <meshStandardMaterial color="#2d313a" />
      </mesh>
      {/* 문, 로봇 */}
      <Door3D isOpen={isOpen} isWrong={isWrong} />
      <Robot3D onClick={onRobotClick} balloonText={balloonText} />
    </Canvas>
  );
}

import { useChatLLM } from "../hooks/useChatLLM";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const failAudioRef = useRef<HTMLAudioElement>(null);
  const openAudioRef = useRef<HTMLAudioElement>(null);

  // 시놉시스 오버레이 상태
  const [showSynopsis, setShowSynopsis] = useState(true);

  // ChatBox 상태를 Home에서 관리
  const chat = useChatLLM();
  const { messages, sendMessage, loading } = chat;
  const [isSolved, setIsSolved] = useState(false);

  // 정답 체크 및 문 열림 처리
  const handleSend = (text: string) => {
    if (!text.trim() || loading || isSolved) return;
    sendMessage(text);
    if (text.trim() === "열쇠") {
      setIsSolved(true);
      setIsOpen(true);
      if (openAudioRef.current) {
        openAudioRef.current.currentTime = 0;
        openAudioRef.current.play();
      }
    } else {
      setIsWrong(true);
      if (failAudioRef.current) {
        failAudioRef.current.currentTime = 0;
        failAudioRef.current.play();
      }
      setTimeout(() => setIsWrong(false), 700);
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
        <ThreeScene
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
