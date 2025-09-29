import type { Context } from 'hono';
import { html } from 'hono/html';
import { streamSSE } from 'hono/streaming';
import type { SessionService } from '../../../domain/services/session-service.ts';
import { HonoSessionAdapter } from '../../out/infrastructure/hono-session-adapter';

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async renderSessionPage(c: Context): Promise<Response> {
    const persistence = new HonoSessionAdapter(c);
    const session = await this.sessionService.getCurrentSession(persistence);

    const page = html`<!DOCTYPE html lang="en">
      <html>
        <head>
          <title>Clair Obscur</title>
          <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.5/bundles/datastar.js"></script>
        </head>
        <body>
          <h1>Active Sessions</h1>
          <div>Your session: <strong>${session.animalName.displayName}</strong></div>
          <div id="sessions"></div>
          <script>
            const currentSessionId = '${session.id.value}';
            const sessionsDiv = document.getElementById('sessions');

            const updateSessions = (sessions) => {
              sessionsDiv.innerHTML = sessions
                .map((sessionData) => {
                  const isCurrent = sessionData.id === currentSessionId;
                  return '<div class="session-id' + (isCurrent ? ' current-session' : '') + '">' + sessionData.animalName + '</div>';
                })
                .join('');
            };

            const eventSource = new EventSource('/sse');

            eventSource.onmessage = (event) => {
              const sessions = JSON.parse(event.data);
              updateSessions(sessions);
            };

            setInterval(() => {
              fetch('/alive', {
                method: 'POST',
                credentials: 'same-origin',
              });
            }, 1000);
          </script>
        </body>
      </html>`;

    return c.html(page);
  }

  async keepAlive(c: Context): Promise<Response> {
    const persistence = new HonoSessionAdapter(c);

    try {
      await this.sessionService.getCurrentSession(persistence);
      return c.json({ success: true });
    } catch {
      return c.json({ success: false });
    }
  }

  streamActiveSessions(c: Context): Response {
    return streamSSE(c, async (stream) => {
      while (true) {
        const activeSessions = await this.sessionService.getActiveSessions();
        const sessionData = activeSessions.map((session) => ({
          id: session.id.value,
          animalName: session.animalName.displayName,
        }));

        await stream.writeSSE({
          data: JSON.stringify(sessionData),
        });
        await stream.sleep(1000);
      }
    });
  }
}
