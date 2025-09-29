import { useSession } from '@hono/session';
import 'dotenv/config';
import { Hono } from 'hono';
import { html } from 'hono/html';
import { streamSSE } from 'hono/streaming';

interface SessionData {
  id?: string;
}

const app = new Hono<{
  Variables: {
    session: {
      get: <T = SessionData>() => Promise<T | undefined>;
      update: <T = SessionData>(data: T) => Promise<void>;
      delete: () => void;
    };
  };
}>();

app.use(
  '*',
  useSession({
    secret: process.env.SESSION_PASSWORD ?? 'default_32_characters_long_password_1234567890',
  }),
);

const activeSessions = new Map<string, number>();

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > 10000) {
      activeSessions.delete(sessionId);
    }
  }
}, 1000);

app.get('/', async (c) => {
  let session: SessionData | undefined;

  try {
    session = await c.var.session.get<SessionData>();
  } catch {
    // Clear corrupted session and create new one
    c.var.session.delete();
    session = undefined;
  }

  if (!session?.id) {
    const newId = crypto.randomUUID();
    await c.var.session.update<SessionData>({ id: newId });
    session = { id: newId };
  }

  const sessionId = session.id ?? '';
  activeSessions.set(sessionId, Date.now());

  const page = html`<!DOCTYPE html lang="en">
    <html>
      <head>
        <title>Clair Obscur</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.5/bundles/datastar.js"></script>
      </head>
      <body>
        <h1>Active Sessions</h1>
        <div>Your session: <strong>${sessionId}</strong></div>
        <div id="sessions"></div>
        <script>
          const currentSessionId = '${sessionId}';
          const sessionsDiv = document.getElementById('sessions');

          const updateSessions = (sessionIds) => {
            sessionsDiv.innerHTML = sessionIds
              .map((id) => {
                const isCurrent = id === currentSessionId;
                return '<div class="session-id' + (isCurrent ? ' current-session' : '') + '">' + id + '</div>';
              })
              .join('');
          };

          const eventSource = new EventSource('/sse');

          eventSource.onmessage = (event) => {
            const sessionIds = JSON.parse(event.data);
            updateSessions(sessionIds);
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
});

app.post('/alive', async (c) => {
  let session: SessionData | undefined;

  try {
    session = await c.var.session.get<SessionData>();
  } catch {
    // Clear corrupted session
    c.var.session.delete();
    return c.json({ success: false });
  }

  const sessionId = session?.id;

  if (sessionId) {
    activeSessions.set(sessionId, Date.now());
  }

  return c.json({ success: true });
});

app.get('/sse', (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const sessionIds = Array.from(activeSessions.keys());
      await stream.writeSSE({
        data: JSON.stringify(sessionIds),
      });
      await stream.sleep(1000);
    }
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
