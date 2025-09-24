import { homeController } from '@/adapters/in/web/home-controller';
import { ROUTES } from '@/adapters/in/web/routes';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { MemoryStore, sessionMiddleware } from 'hono-sessions';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

// Middleware de sessions
app.use(
  '*',
  sessionMiddleware({
    store: new MemoryStore(),
    encryptionKey: 'a-very-secret-key-that-should-be-32-chars-long!', // 32 chars
    cookieOptions: {
      httpOnly: true,
      secure: false, // true en HTTPS
      sameSite: 'Lax',
      maxAge: 1800, // 30 minutes
    },
  }),
);

app.get(ROUTES.HOME, (c) => homeController.getHomePage(c));
app.get(ROUTES.HOME_ALT, (c) => homeController.getHomePage(c));
app.get(ROUTES.COUNTER.BASE, (c) => homeController.getCounter(c));
app.patch(ROUTES.COUNTER.RESET, () => homeController.counterReset());

app.get(ROUTES.API.HEALTH, (c) => c.json({ status: 'ok' }));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
