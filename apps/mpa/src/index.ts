import { SessionController } from '@/adapters/in/web/session-controller';
import { EventStoreSessionAdapter } from '@/adapters/out/session/event-store-session-adapter';
import { SessionCommandService } from '@/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/adapters/out/session/session-query.service';
import { EventStore } from '@/infrastructure/event-store/event-store.service';
import { DefaultAnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';

import { authSecret, isDevelopment, isProduction, port } from '@/infrastructure/config';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { useSession } from '@hono/session';
import { Hono } from 'hono';
import { readFileSync } from 'node:fs';
import { createServer as createHttp2Server, createSecureServer } from 'node:http2';

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

const eventStore = new EventStore();
const sessionAdapter = new EventStoreSessionAdapter(eventStore);
const animalNameGenerator = new DefaultAnimalNameGenerator();
const sessionCommandService = new SessionCommandService(sessionAdapter, sessionAdapter, animalNameGenerator);
const sessionQueryService = new SessionQueryService(sessionAdapter);
const sessionController = new SessionController(sessionCommandService, sessionQueryService, eventStore);

app.get('/', sessionMiddleware, (c) => sessionController.renderSessionPage(c));

app.get('/subscribe-to-events', sessionMiddleware, (c) => sessionController.broadcastEvents(c));

app.post('/font-change', sessionMiddleware, (c) => sessionController.setFont(c));

if (!isDevelopment) {
  const serverConfig = isProduction
    ? {
        fetch: app.fetch,
        port: Number(port),
        createServer: createHttp2Server,
      }
    : {
        fetch: app.fetch,
        port: Number(port),
        createServer: createSecureServer,
        serverOptions: {
          key: readFileSync(path.join(__dirname, '../../../certs/localhost-key.pem')),
          cert: readFileSync(path.join(__dirname, '../../../certs/localhost-cert.pem')),
          allowHTTP1: true,
        },
      };

  const server = serve(serverConfig);

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
