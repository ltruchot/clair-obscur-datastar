import { SessionController } from '@/session/adapters/in/web/session-controller';
import { EventStoreSessionAdapter } from '@/session/adapters/out/session/event-store-session-adapter';
import { SessionCommandService } from '@/session/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/session/adapters/out/session/session-query.service';
import { EventStore } from '@/session/infrastructure/event-store/event-store.service';
import { SessionMonitorService } from '@/session/infrastructure/session/session-monitor.service';
import { DefaultAnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';

import { authSecret, isDevelopment, port } from '@/shared/infrastructure/config';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { useSession } from '@hono/session';
import { Hono } from 'hono';

import { SessionData } from '@/session/infrastructure/session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// Use globalThis to survive HMR reloads in development
const MONITOR_SYMBOL = Symbol.for('session-monitor');

type GlobalWithMonitor = Record<symbol, SessionMonitorService | undefined>;

// Clean up old monitor if present (HMR reload)
const global = globalThis as unknown as GlobalWithMonitor;
if (global[MONITOR_SYMBOL]) {
  if (isDevelopment) {
    console.log('Stopping previous session monitor (HMR reload)');
  }
  global[MONITOR_SYMBOL]?.stop();
}

const sessionMonitor = new SessionMonitorService(sessionQueryService, sessionCommandService);
sessionMonitor.start();
global[MONITOR_SYMBOL] = sessionMonitor;

if (isDevelopment) {
  console.log('Session monitor started');
}

app.get('/', sessionMiddleware, (c) => sessionController.renderSessionPage(c));

app.get('/subscribe-to-events', sessionMiddleware, (c) => sessionController.broadcastEvents(c));

app.post('/keep-alive', sessionMiddleware, (c) => sessionController.keepAlive(c));

app.post('/font-change', sessionMiddleware, (c) => sessionController.setFont(c));

if (!isDevelopment) {
  const serverConfig = {
    fetch: app.fetch,
    port: Number(port),
  };

  const server = serve(serverConfig);

  server.once('listening', () => {
    console.log(`Server is running on port ${port}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\nReceived ${signal}, closing server gracefully...`);
    sessionMonitor.stop();
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
