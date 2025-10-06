import { HonoSessionAdapter } from '@/adapters/out/session/hono-session-adapter';
import { SessionService } from '@/adapters/out/session/session-service';
import { isDevelopment } from '@/infrastructure/config';
import type { Session } from '@clair-obscur-workspace/domain';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { html } from 'hono/html';

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async renderSessionPage(c: Context): Promise<Response> {
    const persistence = new HonoSessionAdapter(c);
    const session: Session = await this.sessionService.getCurrentSession(persistence);
    const animalName = session?.animalName ? session.animalName.adjective + ' ' + session.animalName.animal : 'an unknown animal';
    const color = session?.color ?? '#000000';

    const page = html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Clair Obscur</title>
          <script type="module" src="/web-components/list-element.es.js"></script>
          <script type="module" src="/web-components/color-picker-element.es.js"></script>

          ${isDevelopment
            ? html`
                <script type="module" src="/assets/scripts/datastar-pro/datastar-pro.js"></script>
                <script type="module" src="/assets/scripts/datastar-pro/datastar-inspector.js"></script>
              `
            : html`<script type="module" src="/assets/scripts/datastar-community/datastar.js"></script>`}

          <link rel="icon" href="/assets/favicon/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <h1 data-on-interval__duration.2s.leading="@get('/alive')">Active Sessions</h1>
          You are
          <strong id="personal-session" style="color: ${color}">${animalName}</strong>

          <color-picker
            data-signals-color_changed
            data-on-colorchange="$color_changed = event.detail.value; @post('/color')"></color-picker>
          <div data-text="$_color_changed"></div>

          <hr />
          <div>All animals on this channel:</div>
          <list-element id="sessions" data-attr-items="$items"></list-element>

          ${isDevelopment ? html` <datastar-inspector></datastar-inspector> ` : ''}
        </body>
      </html>`;

    return c.html(page);
  }

  async setColor(c: Context) {
    const jsonBody = await c.req.json();
    const persistence = new HonoSessionAdapter(c);
    await this.sessionService.setColor(persistence, jsonBody.color_changed);
    const currentSession = await this.sessionService.getCurrentSession(persistence);
    const sessionItems = await this.mapSessionToListItems(c);

    return ServerSentEventGenerator.stream((stream) => {
      stream.patchElements(`
        <strong id="personal-session" style="color:${currentSession.color}">${currentSession.animalName.adjective} ${currentSession.animalName.animal}</strong>
      `);

      stream.patchSignals(JSON.stringify({ items: JSON.stringify(sessionItems) }));
    });
  }

  async keepAlive(c: Context) {
    const persistence = new HonoSessionAdapter(c);

    try {
      const currentSession = await this.sessionService.getCurrentSession(persistence);
      const sessionItems = await this.mapSessionToListItems(c);

      return ServerSentEventGenerator.stream((stream) => {
        stream.patchElements(`
          <strong id="personal-session" style="color:${currentSession.color}">${currentSession.animalName.adjective} ${currentSession.animalName.animal}</strong>
        `);

        stream.patchSignals(JSON.stringify({ items: JSON.stringify(sessionItems) }));
      });
    } catch {
      return ServerSentEventGenerator.stream((stream) => {
        stream.patchElements(`
          <strong id="personal-session">an unknown animal</strong>
        `);
        stream.patchSignals(JSON.stringify({ items: JSON.stringify([]) }));
      });
    }
  }

  private async mapSessionToListItems(c: Context) {
    const persistence = new HonoSessionAdapter(c);
    const currentSession = await this.sessionService.getCurrentSession(persistence);
    const activeSessions = await this.sessionService.getActiveSessions();
    const isCurrentSession = (session: Session) => session.id.value === currentSession.id.value;
    return activeSessions.map((session) => ({
      id: session.id.value,
      label: `${session.animalName.adjective} ${session.animalName.animal}`,
      color: session.color,
      isCurrentSession: isCurrentSession(session),
    }));
  }
}
