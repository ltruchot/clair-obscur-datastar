import type { Context } from 'hono';
import { html } from 'hono/html';

import { baseLayout } from '@/infrastructure/templates/base-layout';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import { ROUTES } from './routes';

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

setInterval(() => {
  counter++;
  broadcastCounter();
}, 1000);

export const homeController = {
  getCounter: function (): Response {
    return ServerSentEventGenerator.stream(
      (stream) => {
        activeStreams.add(stream);
        stream.patchSignals(`{"counter": ${counter}, "activeStreams": ${activeStreams.size}}`);
      },
      {
        keepalive: true,
      },
    );
  },

  counterReset: function (c: Context): Response {
    counter = 0;
    broadcastCounter();
    return c.json({ status: 'ok' });
  },

  getHomePage: async function (c: Context) {
    const content = html`
      <main data-on-load="@get('${ROUTES.COUNTER.BASE}')">
        <section>
          <button data-on-click="@patch('${ROUTES.COUNTER.RESET}')">Reset shared counter</button>
          <div>Shared counter is running since <strong data-text="$counter"></strong> seconds</div>
          <div>Number of active streams: <strong data-text="$activeStreams"></strong></div>
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
