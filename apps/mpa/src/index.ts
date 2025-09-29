import { DefaultAnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { useSession } from '@hono/session';
import { Hono } from 'hono';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SessionController } from './adapters/in/web/session-controller';
import { authSecret, isDevelopment, port } from './adapters/out/infrastructure/config';
import { InMemorySessionRepository } from './adapters/out/infrastructure/in-memory-session-repository';
import { DefaultSessionService } from './domain/services/session-service';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (isDevelopment) {
  app.use('/pro.js', serveStatic({ path: path.join(__dirname, 'datastar-pro/pro.js') }));
  app.use('/inspector.js', serveStatic({ path: path.join(__dirname, 'datastar-pro/inspector.js') }));
}

app.use(
  '*',
  useSession({
    secret: authSecret,
  }),
);

const sessionRepository = new InMemorySessionRepository();
const animalNameGenerator = new DefaultAnimalNameGenerator();
const sessionService = new DefaultSessionService(sessionRepository, animalNameGenerator);
const sessionController = new SessionController(sessionService);

app.get('/', (c) => sessionController.renderSessionPage(c));

app.get('/alive', (c) => sessionController.keepAlive(c));

serve({
  fetch: app.fetch,
  port: Number(port),
}).once('listening', () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
