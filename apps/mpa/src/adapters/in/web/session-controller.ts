import { HonoSessionAdapter } from '@/adapters/out/session/hono-session-adapter';
import { SessionService } from '@/adapters/out/session/session-service';
import { isDevelopment } from '@/infrastructure/config';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { html } from 'hono/html';

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async renderSessionPage(c: Context): Promise<Response> {
    const page = html`<!DOCTYPE html lang="en">
      <html>
        <head>
          <title>Clair Obscur</title>
          <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.5/bundles/datastar.js"></script>
          <script type="module" src="/web-components/list-element.es.js"></script>

          ${isDevelopment
            ? html`
                <script type="module" src="pro.js"></script>
                <script type="module" src="inspector.js"></script>
              `
            : ''}
        </head>
        <body>
          <h1 data-on-interval__duration.1s.leading="@get('/alive')">Active Sessions</h1>
          You are <strong id="personal-session">an unknown animal</strong>
          <hr />
          <div>All animals on this channel:</div>
          <list-element id="sessions"></list-element>

          ${isDevelopment ? html` <datastar-inspector></datastar-inspector> ` : ''}
        </body>
      </html>`;

    return c.html(page);
  }

  async keepAlive(c: Context) {
    const persistence = new HonoSessionAdapter(c);

    try {
      const currentSession = await this.sessionService.getCurrentSession(persistence);
      const activeSessions = await this.sessionService.getActiveSessions();
      const sessionItems = activeSessions.map((session) => ({
        id: session.id.value,
        label: `${session.animalName.adjective} ${session.animalName.animal}${session.id.value === currentSession.id.value ? ' (you)' : ''}`,
      }));

      return ServerSentEventGenerator.stream((stream) => {
        stream.patchElements(`
          <strong id="personal-session">${currentSession.animalName.adjective} ${currentSession.animalName.animal}</strong>
        `);
        stream.executeScript(`
          document.getElementById('sessions').items = ${JSON.stringify(sessionItems)};
        `);
      });
    } catch {
      return ServerSentEventGenerator.stream((stream) => {
        stream.patchElements(`
          <strong id="personal-session">an unknown animal</strong>
        `);
        stream.executeScript(`
          document.getElementById('sessions')items = [];
        `);
      });
    }
  }
}
