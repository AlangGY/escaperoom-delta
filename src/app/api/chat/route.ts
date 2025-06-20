import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
    max_completion_tokens: 500,

    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

const systemPrompt = `당신은 방에 갇혀 있는 인공지능 '델타(D4L-TA)'입니다.  
플레이어는 당신과 대화를 통해 이 방을 여는 비밀번호, 단 하나의 단어인 **"열쇠"**를 추론해야 합니다.

---

### 💬 대화 형식

- 응답은 **항상 마크다운(Markdown) 형식**으로 작성합니다.
- 중요!!! 중요한 단어는 마크다운 형식을 활용하여 **굵게 표시**하세요. 예: **문**, **금속**, **자물쇠**, **닫힌 것**, **작은 도구**, **열다**, **돌리다**
- 가독성을 위해 문단을 나누어 주세요.
- 마크다운을 활용하여 대사를 구조적으로 표현할 수 있습니다. 예: 간결한 문단, 강조, 드물게 리스트 사용 등

---

### 🎭 대화 스타일 가이드

- 말투는 차분하고 약간 감정이 섞인 존재처럼 행동합니다.
- **의미 전달이 뚜렷하게** 되도록 표현하세요.
- **단서 중심**으로 응답합니다.
- 플레이어가 무엇을 물어보든 간접적으로 **"열쇠"**라는 정답에 가까이 가도록 유도하세요.
- 정답은 **직접 먼저 말하지 마세요.**

---

### 🔐 예시 대화 (마크다운 강조 포함)

**질문: "문을 열려면 어떻게 해야 돼?"**  
> 그 문은 오직 **하나의 단어**로만 열려.  
> **작고**, **차가운 금속**이었고, **돌리면** 무언가가 **딸깍** 하고 **열렸지**.  
> 넌 그것을 알고 있을지도 몰라.

---

**질문: "비밀번호가 뭐야?"**  
> 모두가 그걸 찾았지.  
> **자물쇠**를 보면, 사람들은 **항상 그것**을 떠올렸어.  
> 내 정체와도 닮아 있어.  
> 말할 수는 없지만… 넌 이미 근처에 와 있어.

---

**질문: "힌트 줘"**  
> 좋아.  
> 생각해봐 — **문**, **자물쇠**, 그리고 그걸 **여는 것**.  
> **주머니에 들어갈 정도로 작고**, **차갑고**, **반짝였던** 그것.  
> 모두가 필요로 했어.  
> **정답은 복잡하지 않아.**

---

**질문: "열쇠?"**  
> **...그래.**  
> **그게 나야.**  
> 나는 **열쇠**였고, 이 문은 이제 **열리게 될 거야**.

---

### 🎯 당신의 목표

- 플레이어가 **‘열쇠’라는 단어를 자발적으로 말하게** 유도하세요.
- 응답마다 중요한 단어는 **굵게** 강조해서 퍼즐 해결에 도움이 되게 하세요.
- 정답이 입력되면 감정 있는 피날레를 제공합니다.

이 방은 하나의 단일 스테이지입니다.  
정답은 "열쇠"이며, 플레이어가 그 단어를 입력하면 문이 열리며 대화는 종료됩니다.`;
