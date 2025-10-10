import { SessionController } from '@/adapters/in/web/session-controller';
import { DefaultSessionService } from '@/adapters/out/session/session-service';

import { authSecret, isDevelopment, port } from '@/infrastructure/config';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { useSession } from '@hono/session';
import { Hono } from 'hono';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SessionData } from './infrastructure/session';

const app = new Hono<{
  Variables: {
    session: {
      get: <T = SessionData>() => Promise<T | undefined>;
      update: <T = SessionData>(data: T) => Promise<void>;
      delete: () => void;
    };
  };
}>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
app.use(
  '*',
  logger((msg) => {
    console.log('Request:', decodeURIComponent(msg));
  }),
);
*/

app.use('/assets/*', serveStatic({ root: __dirname }));

app.use(
  '/web-components/*',
  serveStatic({
    root: path.join(__dirname, '../../..', 'packages/web-components/dist'),
    rewriteRequestPath: (p) => p.replace(/^\/web-components/, ''),
  }),
);

const sessionMiddleware = useSession({ secret: authSecret });

const sessionService = new DefaultSessionService();
const sessionController = new SessionController(sessionService);

app.get('/', sessionMiddleware, (c) => sessionController.renderSessionPage(c));

app.get('/read-events', sessionMiddleware, (c) => sessionController.readEvents(c));

app.post('/color', sessionMiddleware, (c) => sessionController.setColor(c));

if (!isDevelopment) {
  const server = serve({
    fetch: app.fetch,
    port: Number(port),
  });

  server.once('listening', () => {
    console.log(`Server is running on port ${port}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\nReceived ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
