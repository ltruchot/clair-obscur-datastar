import type { SessionData as SessionDataFromHono } from '@hono/session';

export interface SessionData extends SessionDataFromHono {
  id?: string;
  color?: string;
  animalName?: string;
  lastSeen?: string;
}
