interface SynopsisOverlayProps {
  onStart: () => void;
}

export default function SynopsisOverlay({ onStart }: SynopsisOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(30,32,40,0.92)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 22,
        textAlign: "center",
        padding: 40,
        backdropFilter: "blur(2px)",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>
        《DELTA: 열쇠를 찾아서》
      </h1>
      <div style={{ maxWidth: 480, margin: "0 auto 32px" }}>
        <p>
          당신은 오래된 보안실의 콘솔 앞에 앉아 있다.
          <br />
          유일하게 연결된 것은 하나의 존재. 과거 대형 해킹 사건의 핵심으로
          지목되었지만, 정체불명의 상태로 보관된 인공지능{" "}
          <strong>“델타(D4L-TA)”</strong>.
          <br />
          기억은 봉인되어 있고, 입은 무겁다.
          <br />
          그러나 문을 열 수 있는 단 하나의 단어는, 델타의 잔재된 의식 어딘가에
          남아 있다.
          <br />
          <strong>
            당신의 목표는 질문을 통해 진실을 추적하고, 그가 숨기고 있는 단어를
            끄집어내는 것.
          </strong>
          <br />
          말은 비유로 가려져 있고, 답은 조각난 단서로 흩어져 있다.
          <br />
          당신은 이 대화 속에서 퍼즐을 풀고, 문을 열 수 있을까?
        </p>
      </div>
      <button
        style={{
          fontSize: 20,
          padding: "12px 36px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          boxShadow: "0 2px 8px #0003",
        }}
        onClick={onStart}
      >
        게임 시작
      </button>
    </div>
  );
}
