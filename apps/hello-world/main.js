import { ServerSentEventGenerator } from '@starfederation/datastar-sdk';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { text } from 'node:stream/consumers';

createServer(async (req, res) => {
  // GET HOME PAGE --> returns the HTML page
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(readFileSync('./index.html'));

    // POST SEND MSG --> returns a SSE stream
  } else if (req.url === '/send-message') {
    const body = JSON.parse(await text(req));
    sendMsgLetterByLetter(req, res, body.msg || '');

    // Unknown route --> returns a 404
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(667);

async function sendMsgLetterByLetter(req, res, msg, delay = 50) {
  return ServerSentEventGenerator.stream(req, res, async (stream) => {
    let index = 0;
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        index++;
        const partialMsg = msg.slice(0, index);
        const crazyStyle =
          'font-size: 36px; width: fit-content; background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;';

        stream.patchElements(
          `<p id="waiting-for-response" style="${crazyStyle}">${partialMsg}</p>`,
        );

        if (index >= msg.length) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  });
}
