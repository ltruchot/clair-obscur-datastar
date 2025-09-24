import { homeController } from '@/adapters/in/web/home-controller';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

app.get('/', (c) => homeController.getHomePage(c));
app.get('/home', (c) => homeController.getHomePage(c));
app.patch('/home/hal', () => homeController.patchHal());

app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
