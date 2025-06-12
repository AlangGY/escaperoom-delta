import { animated, useSpring } from "@react-spring/three";

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
    <animated.group
      position={[-1, 0, -1.9]}
      rotation={styles.rotation as unknown as [number, number, number]}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
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
      {/* 바닥 */}
    </animated.group>
  );
}
