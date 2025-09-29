import { useSession } from '@hono/session';
import 'dotenv/config';
import { Hono } from 'hono';
import { SessionController } from './adapters/in/web/session-controller';
import { InMemorySessionRepository } from './adapters/out/infrastructure/in-memory-session-repository';
import { DefaultAnimalNameGenerator } from './domain/services/animal-name-generator';
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

app.use(
  '*',
  useSession({
    secret: process.env.SESSION_PASSWORD ?? 'default_32_characters_long_password_1234567890',
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
