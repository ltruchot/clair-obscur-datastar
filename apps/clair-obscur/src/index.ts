// node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// npm
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { useSession } from '@hono/session';
import { Hono } from 'hono';

// external
import { DefaultAnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';

// local
import orcaPixelGrid from '@/assets/pixel-grids/orca-enriched.json';
import { PixelData } from '@/home/adapters/in/models/pixels';
import { HomeController } from '@/home/adapters/in/web/home-controller';
import { EventStorePixelGridAdapter } from '@/home/adapters/out/pixelgrid/event-store-pixel-grid-adapter';
import { PixelGridCommandService } from '@/home/adapters/out/pixelgrid/pixelgrid-command.service';
import { PixelGridQueryService } from '@/home/adapters/out/pixelgrid/pixelgrid-query.service';
import { EventStoreSessionAdapter } from '@/home/adapters/out/session/event-store-session-adapter';
import { SessionCommandService } from '@/home/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/home/adapters/out/session/session-query.service';
import { SessionService } from '@/home/adapters/out/session/session-service';

import { PixelGridEventStore } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.service';
import { SessionData } from '@/home/infrastructure/session';
import { SessionEventStore } from '@/home/infrastructure/session/session-event-store.service';
import { SessionMonitorService } from '@/home/infrastructure/session/session-monitor.service';

import { authSecret, isDevelopment, port } from '@/shared/infrastructure/config';

// A Hono app with built-in session management
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

app.use(
  '/*',
  serveStatic({
    root: __dirname + '/assets',
    rewriteRequestPath: (p) => p.replace(/^\/assets/, ''),
  }),
);

app.use(
  '/web-components/*',
  serveStatic({
    root: path.join(__dirname, '../../..', 'packages/web-components/dist'),
    rewriteRequestPath: (p) => p.replace(/^\/web-components/, ''),
  }),
);

// middlewares
const sessionMiddleware = useSession({ secret: authSecret });

// instantiate stuff
const sessionEventStore = new SessionEventStore();
const sessionAdapter = new EventStoreSessionAdapter(sessionEventStore);
const animalNameGenerator = new DefaultAnimalNameGenerator();
const sessionCommandService = new SessionCommandService(
  sessionAdapter,
  sessionAdapter,
  animalNameGenerator,
);
const sessionQueryService = new SessionQueryService(sessionAdapter);
const sessionService = new SessionService(sessionQueryService, sessionCommandService);

const pixelGridEventStore = new PixelGridEventStore();
pixelGridEventStore.initialize(orcaPixelGrid as PixelData);
const pixelGridAdapter = new EventStorePixelGridAdapter(pixelGridEventStore);
const pixelGridQueryService = new PixelGridQueryService(pixelGridAdapter);
const pixelGridCommandService = new PixelGridCommandService(pixelGridAdapter);

const homeController = new HomeController(
  sessionEventStore,
  sessionCommandService,
  sessionService,
  pixelGridEventStore,
  pixelGridQueryService,
  pixelGridCommandService,
);

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

app.get('/', sessionMiddleware, (c) => homeController.renderHomePage(c));

app.get('/subscribe-to-events', sessionMiddleware, (c) => homeController.broadcastEvents(c));

app.post('/keep-alive', sessionMiddleware, (c) => homeController.keepAlive(c));

app.post('/font-change', sessionMiddleware, (c) => homeController.setFont(c));

app.post('/pixel-click', sessionMiddleware, (c) => homeController.updatePixel(c));

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
