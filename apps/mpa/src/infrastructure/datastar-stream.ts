import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';

export type SSE = typeof ServerSentEventGenerator.prototype;
export const closeStream = (stream: ServerSentEventGenerator) => {
  try {
    (stream as SSE & { controller: ReadableStreamController<unknown> })?.controller?.close();
  } catch (err) {
    console.error('Error closing stream', err);
  }
};
