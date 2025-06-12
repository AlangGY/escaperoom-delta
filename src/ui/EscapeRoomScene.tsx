import { Canvas } from "@react-three/fiber";
import Door3D from "./Door3D";
import Robot3D from "./Robot3D";

interface EscapeRoomSceneProps {
  isOpen: boolean;
  isWrong: boolean;
  balloonText: string;
  onRobotClick?: () => void;
}

export default function EscapeRoomScene({
  isOpen,
  isWrong,
  balloonText,
  onRobotClick,
}: EscapeRoomSceneProps) {
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
