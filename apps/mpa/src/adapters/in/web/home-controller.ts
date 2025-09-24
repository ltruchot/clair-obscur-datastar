import type { Context } from 'hono';
import { html } from 'hono/html';

import { baseLayout } from '@/infrastructure/templates/base-layout';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';

export const homeController = {
  patchHal: function (): Response {
    return ServerSentEventGenerator.stream(
      (stream) => {
        stream.patchElements(`<div id="hal">I'm sorry, Dave. I'm afraid I can't do that.</div>`);

        setTimeout(() => {
          stream.patchElements(`<div id="hal">Waiting for an order...</div>`);
        }, 1000);
      },
      {
        keepalive: true,
      },
    );
  },

  getHomePage: async function (c: Context) {
    const content = html`
      <main class="home-container">
        <h1>Welcome to Clair-Obscur</h1>
        <p>A hypermedia-first MPA with Hono and Datastar</p>
          <button data-on-click="@patch('/home/hal')">Open the pod bay doors, HAL.</button>
          <div id="hal">Waiting for HAL...</div>
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
