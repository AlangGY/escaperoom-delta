"use client";

import Door3D from "@/ui/Door3D";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import ChatBox from "../ui/ChatBox";
import Robot3D from "../ui/Robot3D";

type ThreeSceneProps = {
  isOpen: boolean;
  isWrong: boolean;
  onRobotClick: () => void;
};
function ThreeScene({ isOpen, isWrong, onRobotClick }: ThreeSceneProps) {
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
      {/* 로봇 위 천장 스포트라이트 */}

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
      <Robot3D
        onClick={onRobotClick}
        balloonText="당신인가. 이번엔 무슨 질문을 하러 왔지?"
      />
    </Canvas>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showEnding, setShowEnding] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      <div className="relative w-full h-screen min-h-screen overflow-hidden">
        {/* 3D 전체화면 */}
        <ThreeScene
          isOpen={isOpen}
          isWrong={isWrong}
          onRobotClick={() => setIsChatOpen(true)}
        />
        {/* Floating 정답 입력창 */}
        {!showEnding ? (
          <form
            onSubmit={handleAnswer}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 bg-white/80 rounded-xl shadow-lg px-4 py-2 md:px-6 md:py-4 flex gap-2 items-center backdrop-blur"
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
              className="border rounded px-4 py-2 text-sm md:text-lg bg-white/80 text-black"
              disabled={isOpen}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded text-lg text-nowrap"
              disabled={isOpen}
            >
              제출
            </button>
          </form>
        ) : (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-2xl font-bold text-green-700 bg-white/80 rounded-xl shadow-lg px-8 py-6 backdrop-blur">
            문이 열렸습니다! 축하합니다 🎉
          </div>
        )}
        {/* 챗봇 오버레이 */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg min-w-[80vw] md:min-w-[50vw] h-[600px] flex flex-col">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox onClose={() => setIsChatOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
