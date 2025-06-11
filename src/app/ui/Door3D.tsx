import { animated, useSpring } from "@react-spring/three";
import { Canvas } from "@react-three/fiber";

interface Door3DProps {
  isOpen: boolean;
  isWrong?: boolean;
}

export default function Door3D({ isOpen, isWrong }: Door3DProps) {
  const styles = useSpring({
    rotation: isOpen
      ? [0, -Math.PI / 2, 0]
      : isWrong
      ? [0, 0.1 * Math.sin(Date.now() / 30), 0]
      : [0, 0, 0],
    color: isWrong ? "#e74c3c" : isOpen ? "#b2e672" : "#888",
    config: isWrong
      ? { mass: 1, tension: 400, friction: 10, precision: 0.01 }
      : { mass: 1, tension: 120, friction: 18 },
  });

  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      style={{ background: "#e5e5e5", borderRadius: 16 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
      <animated.group
        position={[-1, 0, 0]}
        rotation={styles.rotation as unknown as [number, number, number]}
      >
        <animated.mesh castShadow receiveShadow position={[1, 0, 0]}>
          <boxGeometry args={[2, 4, 0.2]} />
          <animated.meshStandardMaterial
            color={styles.color as unknown as string}
          />
        </animated.mesh>
        {/* 손잡이 */}
        <mesh position={[1.9, -0.7, 0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 32]} />
          <meshStandardMaterial color="#d1a355" />
        </mesh>
      </animated.group>
      {/* 바닥 */}
      <mesh position={[0, -2.1, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial color="#ccc" />
      </mesh>
    </Canvas>
  );
}
