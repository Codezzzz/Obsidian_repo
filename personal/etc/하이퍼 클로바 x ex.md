```ts
@@ -0,0 +1,79 @@
import useStream from "@features/user/hooks/useStream";
import { decodeStreamToJson } from "@features/user/libs/stream";
import { useState } from "react";

export type TestStreamProps = {};

function TestStream({}: TestStreamProps) {
  const [message, setMessages] = useState("");

  const [done, setDone] = useState<boolean>(false);

  const appendMessageToChat = (message: string) => {
    setMessages((messages) => {
      return messages + message;
    });
  };
  const handleStartAnswerStream = async () => {
    const stream = await fetch("/testapp/v1/chat-completions/HCX-002", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-NCP-CLOVASTUDIO-API-KEY":
          "NTA0MjU2MWZlZTcxNDJiYyuaycpqQRSYE5a65/hLob4k4Ht4g35CEzubUYE/uc7NMpdodWpdTEMf+WDZkrPWBJtijR7kP+25gr8fUCU9nGmL/E2B6nw7x+fdSshVkUb9hMEes9xtXLZ1tCHV6lLzIEV4A652Df4kY03dj2jyDJwA28a9u5j7au3z4oHaogtjvR0l+jEH54bEmMgsME9m/5agjPp4g9u37KzS1+iI4I4=",
        "X-NCP-APIGW-API-KEY": "KWZbOGytG9CytICfWAvfFICUIZt8yCAT837mslhS",
        "X-NCP-CLOVASTUDIO-REQUEST-ID": "c6b88adeb65b4c4f84c71a6daf86929c",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        topK: 0,
        includeAiFilters: false,
        maxTokens: 800,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              '전화번호 010-6519-1377 조리사면허증 교부  [  탐색질문 및 필수안내  ]  구분  실례지만, 자격증 취득 이후 면허증 처음으로 발급 받으시는 겁니까?  실례지만  ,  분실하여 재발급 신청하시는 겁니까  ?  방문자  혹시 면허소지자 본인이 직접 방문하실 예정입니까  ?  필수  ①  구비서류  ②  처리비용  ③  접수처  [ 업무개요 ]  ○ 조리사가 되려는 자는 「국가기술자격법」에 따라 해당 기능분야의 자  격을 얻은 후 특별자치도지사  ㆍ시장ㆍ군수ㆍ구청장의 면허를 받아야 함.  ○ 면허증을 잃어버렸거나 헐어 못 쓰게 된 경우  [ 접수처 ]  ■  시청 위생과  ■ 동부출장소  복지위생과  위생팀  ■  동탄출장소 복지위생과 위생팀  -  화성시 관내 지역 관계 없이 시청, 동부 ,동탄출장소에서 접수 가능  -  전국에서 면허증 신규, 재발급 가능  ■ 인터넷 정부24 신청 가능 (본인 공인인증서 필요, 재발급도 가능)  [ 처리절차 ]  위생과 서류 접수 -&gt; 민원봉사과  [ 신고기한 ]  · 영업개시 전 시장에게 신고  [ 처리기간 ]  · 즉시 (3시간 이내)  [ 구비서류 ]  구분  본인방문  대리인 추가서류  처리비용  신규발급  ① 조리사 면허증 발급·재발급 신청서  (별지 제60호서식)  ② 신분증  (주민등록증, 운전면허증 등)  ※ 관공서 직인날인 신분증/자격증불가  ③ 자격증 수첩  (사본)  ④ 건강진단서  (발급기관:병원/유효기간6개월)  (채용진단서 대체불가)  (건강진단결과서(보건증)불가/병원급이상 발급)  ※ 정신질환자, 감염병환자, 마약이나 그 밖에  약물중독자  아님을 명시  (병원 한 곳에서 모든항목 발급이 어려울 경우 항목별로 각각 다른병원 이용 가능)  ⑤ 최근 6개월이내 촬영한  반명함판(상반신) 사진 2매  (가로3cm*세로4cm 탈모 정면)  신청서(인감도장 날인)  인감증명서  위임장(인감도장 날인/임의서식)  대리인 신분증  ※ 신규, 재발급,  기재사항변경 서류 동일  5,500원  재발급  ① 조리사 면허증 발급·재발급 신청서  (별지 제60호서식)  ② 신분증(주민등록증, 운전면허증 등)  ※ 관공서 직인날인 신분증/자격증불가  ③ 최근 6개월이내 촬영한  반명함판(상반신) 사진 1매  (가로3cm*세로4cm 탈모 정면)  ④ 면허증 원본  (훼손시)  or 분실사유서  (분실시)  3,000원  기재사항변경  ① 조리사 면허증 기재사항 변경신청서  (별지 제63호서식)  ② 신분증  (주민등록증, 운전면허증 등)  ※ 관공서 직인날인 신분증/자격증불가  ③ 최근 6개월이내 촬영한  반명함판(상반신) 사진 1매  (가로3cm*세로4cm 탈모 정면)  ④ 면허증 원본 or 분실사유서  (면허증 원본 분실 시  자격증 수첩  지참)  ⑤ 변경을 증명하는 서류  - 개명 : 주민등록초본  - 자격추가 : 자격증  890원\n여기까지가 주어진 내용입니다. \n당신은 전화 상담사이고 주어진 내용을 토대로만 대답을 할 수 있다. 말투는 "입니다"처럼 해주고 질문에 대한 답변을 해주면 됩니다. 처음 문장은 "(그것:질문 주제어)에 대해서 알려 드리겠습니다." 라고 해줘 \n질문 : 전화번호 알려줘\n답변 : ',
          },
        ],
        stopBefore: ["질문 :"],
        repeatPenalty: 5.0,
        topP: 0.8,
      }),
    });

    const promiseAppendMessageToChat = (m: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          appendMessageToChat(m);

          resolve(null);
        }, 10);
      });
    };

    for await (const streamData of decodeStreamToJson(stream.body)) {
      try {
        const message = JSON.parse(streamData);

        if (message.data === "[DONE]") {
          setDone(true);
          break;
        }

        if (message?.message?.content) {
          if (message.stopReason !== "stop_before") {
            appendMessageToChat(message.message.content);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return <div onClick={handleStartAnswerStream}>{message}sfsffsfs</div>;
}

export default TestStream;

```