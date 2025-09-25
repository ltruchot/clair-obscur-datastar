import { homeController } from '@/adapters/in/web/home-controller';
import { ROUTES } from '@/adapters/in/web/routes';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

app.get(ROUTES.HOME, (c) => homeController.getHomePage(c));
app.get(ROUTES.HOME_ALT, (c) => homeController.getHomePage(c));
app.get(ROUTES.COUNTER.BASE, (c) => homeController.getCounter(c));
app.patch(ROUTES.COUNTER.RESET, (c) => homeController.counterReset(c));

app.get(ROUTES.API.HEALTH, (c) => c.json({ status: 'ok' }));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
