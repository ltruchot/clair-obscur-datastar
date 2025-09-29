import { DefaultAnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';
import { useSession } from '@hono/session';
import { config } from 'dotenv';
import { Hono } from 'hono';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SessionController } from './adapters/in/web/session-controller';
import { InMemorySessionRepository } from './adapters/out/infrastructure/in-memory-session-repository';
import { DefaultSessionService } from './domain/services/session-service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.join(__dirname, '../../../.env'),
});

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
    secret: process.env.AUTH_SECRET,
  }),
);

const sessionRepository = new InMemorySessionRepository();
const animalNameGenerator = new DefaultAnimalNameGenerator();
const sessionService = new DefaultSessionService(sessionRepository, animalNameGenerator);
const sessionController = new SessionController(sessionService);

app.get('/', (c) => sessionController.renderSessionPage(c));

app.post('/alive', (c) => sessionController.keepAlive(c));

app.get('/sse', (c) => sessionController.streamActiveSessions(c));

const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
