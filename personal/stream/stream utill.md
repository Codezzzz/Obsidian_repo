```ts
import fetchExtended from "@apis/fetchClient";
import { tokenService } from "@utils/tokenService";
import {
  createParser,
  EventSourceParser,
  ParsedEvent,
} from "eventsource-parser";

  
export interface StreamType<T> {
  url: string;
  data: T;
}

  

export interface Message {
  message: { role: string; content: string };
  stopReason: string | null;
}

export async function getStream<T>({ url, data }: StreamType<T>) {
  const response = await fetchExtended(url, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // throw new Error("Network response was not ok");
    return null;
  }

  return response.body;
}

  

export async function* decodeStreamToJson(
  data: ReadableStream<Uint8Array> | null

): AsyncIterableIterator<string> {

  if (!data) return;

  const eventStream = data
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  while (true) {

    const { value, done } = await eventStream.read();
    console.log(value);
    const _value = value as ParsedEvent;
    if (value) {
      yield _value.data;

    }
    if (done) {
      break;
    }
  }
}

  

class EventSourceParserStream extends TransformStream<string, ParsedEvent> {

  constructor() {
    let parser!: EventSourceParser;

    super({
      start(controller) {
        parser = createParser((event) => {
          if (event.type === "event") {
            controller.enqueue(event);
          }
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      },
    });
  }
}
```