```ts
import { useState } from "react";

import { decodeStreamToJson, getStream, StreamType } from "../libs/stream";

  

// generic type cstId 추가

  

interface UseStreamProps<T> {
  streamAppendMessage: (message: string, id: number) => void;
  successStreamGetData: (content: T, data: any) => void;
  successStreamValidate: (message: T) => boolean;
  errorStreamCallback?: (data: any) => void;
}

  

function useStream<T>({
  streamAppendMessage,
  successStreamGetData,
  successStreamValidate,
  errorStreamCallback,
}: UseStreamProps<T>) {

  const [message, setMessages] = useState("");
  const [done, setDone] = useState<boolean>(false);
  const appendMessageToChat = (message: string) => {
    setMessages((messages) => {
      return messages + message;
    });
  };

  

  const streamCallAPi = async <T,>(data: StreamType<T>, cstId: number) => {
    setMessages("");
    setDone(false);
    const stream = await getStream(data);

    if (!stream) {
      // error callback 실행 하기
      errorStreamCallback?.(data.data);
      console.log("ERROR");
      throw new Error();

    }


    const promiseAppendMessageToChat = (m: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          appendMessageToChat(m);
          streamAppendMessage(m, cstId);
          resolve(null);
        }, 10);
      });
    };

  
    for await (const streamData of decodeStreamToJson(stream)) {
      const message = JSON.parse(streamData);

      if (message.data === "[DONE]") {
        setDone(true);
        break;
      }

      if (message?.message?.content) {
        if (message.stopReason !== "stop_before") {
          await promiseAppendMessageToChat(message.message.content);
        }
      }

      if (successStreamValidate(message)) {
        successStreamGetData(message, data.data);
      }
    }
  };

  

  return {
    message,
    done,
    streamCallAPi,
    setMessages,
  };
}

export default useStream;
```