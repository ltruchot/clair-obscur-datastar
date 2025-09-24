import type { Context } from 'hono';
import { html } from 'hono/html';

import { baseLayout } from '@/infrastructure/templates/base-layout';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import { ROUTES } from './routes.ts';

let counter = 0;
const activeStreams = new Set<ServerSentEventGenerator>();

const broadcastCounter = () => {
  activeStreams.forEach((stream) => {
    try {
      stream.patchSignals(`{"counter": ${counter}, "activeStreams": ${activeStreams.size}}`);
    } catch {
      activeStreams.delete(stream);
    }
  });
};

export const homeController = {
  getCounter: function (): Response {
    let currentStream: ServerSentEventGenerator | null = null;

    return ServerSentEventGenerator.stream(
      (stream) => {
        currentStream = stream;
        activeStreams.add(stream);
        stream.patchSignals(`{"counter": ${counter}, "activeStreams": ${activeStreams.size}}`);
        return new Promise((resolve) => {
          setTimeout(resolve, 10000);
        });
      },
      {
        onAbort: () => {
          if (currentStream) {
            activeStreams.delete(currentStream);
            broadcastCounter();
          }
        },
        onError: () => {
          if (currentStream) {
            activeStreams.delete(currentStream);
            broadcastCounter();
          }
        },
      },
    );
  },

  counterReset: function (): Response {
    counter = 0;
    broadcastCounter();
    return ServerSentEventGenerator.stream((stream) => {
      stream.patchSignals(`{"counter": ${counter}, "activeStreams": ${activeStreams.size}}`);
    });
  },

  getHomePage: async function (c: Context) {
    const content = html`
      <main class="home-container" data-on-load="@get('${ROUTES.COUNTER.BASE}')">
        <h1>Welcome to Clair-Obscur</h1>
        <p>A hypermedia-first MPA with Hono and Datastar</p>
        <section>
          <button data-on-click="@patch('${ROUTES.COUNTER.RESET}')">Reset shared counter</button>
          <div>Shared counter is running since <strong data-text="$counter"></strong> seconds</div>
          <div>Number of active users: <strong data-text="$activeStreams"></strong></div>
        </section>
      </main>
    `;

    const page = await baseLayout({
      title: 'Clair-Obscur - Home',
      content,
    });

    return c.html(page);
  },
};

setInterval(() => {
  counter++;
  broadcastCounter();
}, 1000);
