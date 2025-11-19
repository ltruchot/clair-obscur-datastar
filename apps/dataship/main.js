import { ServerSentEventGenerator } from '@starfederation/datastar-sdk';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

const emitter = new EventEmitter();
let state = {
  fuel: 0,
  ignition: false,
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, datastar-request');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET HOME PAGE --> returns the HTML page
  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(readFileSync('./index.html'));

    // GET SUBSCRIBE TO EVENTS --> returns a SSE stream
  } else if (url.pathname === '/subscribe-to-events') {
    ServerSentEventGenerator.stream(
      req,
      res,
      (stream) => {
        stream.patchSignals(`{ "_fuel": ${state.fuel}, "_ignition": ${state.ignition} }`);

        const listener = () => {
          stream.patchSignals(`{ "_fuel": ${state.fuel}, "_ignition": ${state.ignition} }`);
        };

        emitter.on('fuel:changed', listener);

        req.on('close', () => {
          emitter.off('fuel:changed', listener);
        });
      },
      {
        keepalive: true,
      },
    );

    // POST INC FUEL --> increments fuel
  } else if (url.pathname === '/inc-fuel') {
    state.fuel += 1;

    if (state.fuel >= 100) {
      state.ignition = true;
      state.fuel = 0;
      emitter.emit('fuel:changed');

      setTimeout(() => {
        state.ignition = false;
        emitter.emit('fuel:changed');
      }, 10000);
    } else {
      emitter.emit('fuel:changed');
    }

    res.writeHead(202);
    res.end();
    // Unknown route --> returns a 404
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(671, () => {
  console.log('🚀 Add fuel server running at http://localhost:671');
});
