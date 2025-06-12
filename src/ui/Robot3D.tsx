import {
  animated,
  config,
  useSpring,
  useTransition,
} from "@react-spring/three";
import { Html } from "@react-three/drei";
import { marked } from "marked";
import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Robot3DProps {
  onClick?: () => void;
  balloonText?: string;
}

export default function Robot3D({
  onClick,
  balloonText = "안녕하세요!",
}: Robot3DProps) {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [htmlHeight, setHtmlHeight] = useState(0.6); // 3D 단위로 변환된 기본값
  const textRef = useRef<HTMLDivElement>(null);

  const maxHtmlPxHeight = 320; // 최대 픽셀 높이
  const maxHtml3DHeight = maxHtmlPxHeight / 200; // 3D 단위로 변환

  useLayoutEffect(() => {
    if (textRef.current) {
      setHtmlHeight(textRef.current.offsetHeight / 200); // 3D 단위로 변환(조정 필요)
    }
  }, [balloonText]);

  // 커서 스타일 변경
  if (typeof window !== "undefined") {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }

  // 머리 흔들기 + 고개 들기
  const { headRotX } = useSpring({
    headRotX: hovered ? 0 : -0.35, // 고개를 들거나 숙임
    config: config.wobbly,
  });

  // 눈 깜빡임 (스케일 + 밝기)
  const { eyeIntensity, eyeScaleY } = useSpring({
    from: { eyeIntensity: 1.2, eyeScaleY: 1 },
    to: async (next) => {
      while (1) {
        await next({ eyeIntensity: 0.1, eyeScaleY: 0.15 });
        await next({ eyeIntensity: 1.2, eyeScaleY: 1 });
        await new Promise((res) => setTimeout(res, 1000)); // 1초 딜레이
      }
    },
    config: { duration: 1000 },
    loop: true,
  });

  // 말풍선 트랜지션
  const balloonTransition = useTransition(!!balloonText, {
    from: { opacity: 0, scale: 0.7 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.7 },
    config: { tension: 200, friction: 20, duration: 400 },
  });

  // 말풍선 크기 동적 계산
  const fontSize = 0.13;
  const padding = 0.3;
  const minWidth = 0.9;
  const maxWidth = 2.2;
  const verticalPadding = 0.05;
  const textWidth = Math.min(
    Math.max(minWidth, balloonText.length * fontSize * 0.6 + padding),
    maxWidth
  );
  const baseHeight = 0.0;
  const balloonHeight = Math.min(
    Math.max(baseHeight, htmlHeight) + verticalPadding * 2,
    maxHtml3DHeight + verticalPadding * 2
  );
  const balloonY = 1.6 + (balloonHeight - baseHeight) / 2;

  const pxPer3D = 200; // 3D 단위 1 = 200px
  const htmlWidthPx = textWidth * pxPer3D;

  return (
    <animated.group
      ref={group}
      position={[0, -1.2, 2]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 말풍선 트랜지션 */}
      {balloonTransition(
        (style, show) =>
          show && (
            <animated.group
              position={[0.8, balloonY, 0.1]}
              scale={style.scale}
              layers={[1000]}
            >
              {/* 텍스트(HTML) */}
              <Html
                position={[0, verticalPadding, 0.01]}
                center
                distanceFactor={5}
                style={{
                  zIndex: 1000,
                  width: htmlWidthPx + "px",
                  maxWidth: htmlWidthPx + "px",
                  minWidth: htmlWidthPx + "px",
                  background: "white",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <div
                  ref={textRef}
                  style={{
                    color: "#222",
                    fontSize: 18,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    wordBreak: "keep-all",
                    maxHeight: maxHtmlPxHeight,
                    overflowY: "auto",
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: "100%",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(balloonText),
                  }}
                />
              </Html>
            </animated.group>
          )
      )}
      {/* 머리 */}
      <animated.mesh position={[0, 1.1, 0]} rotation-x={headRotX}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#444b58" metalness={0.7} roughness={0.3} />
      </animated.mesh>
      {/* 몸통 */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 32]} />
        <meshStandardMaterial color="#22304a" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* 목 */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.18, 0.04, 16, 100]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* 왼팔 */}
      <mesh position={[-0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 32]} />
        <meshStandardMaterial color="#444b58" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 오른팔 */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 32]} />
        <meshStandardMaterial color="#444b58" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* 왼다리 */}
      <mesh position={[-0.18, -0.5, 0]} rotation={[0, 0, Math.PI / 32]}>
        <cylinderGeometry args={[0.09, 0.09, 0.5, 32]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 오른다리 */}
      <mesh position={[0.18, -0.5, 0]} rotation={[0, 0, -Math.PI / 32]}>
        <cylinderGeometry args={[0.09, 0.09, 0.5, 32]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 눈(붉은 LED 느낌, geometry scaleY로 깜빡임) */}
      <animated.mesh position={[-0.15, 1.22, 0.38]} scale-y={eyeScaleY}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <animated.meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={eyeIntensity as unknown as number}
        />
      </animated.mesh>
      <animated.mesh position={[0.15, 1.22, 0.38]} scale-y={eyeScaleY}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <animated.meshStandardMaterial
          color="#ff3b3b"
          emissive="#ff3b3b"
          emissiveIntensity={eyeIntensity as unknown as number}
        />
      </animated.mesh>
      {/* 몸통에 버튼 */}
      <mesh position={[0, 0.5, 0.37]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.2} />
      </mesh>
    </animated.group>
  );
}
