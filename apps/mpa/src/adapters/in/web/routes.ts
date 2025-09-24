export const ROUTES = {
  HOME: '/',
  HOME_ALT: '/home',
  COUNTER: {
    BASE: '/counter',
    RESET: '/counter/reset',
  },
  API: {
    HEALTH: '/api/health',
    IS_ALIVE: '/is-alive',
  },
} as const;

export type Routes = typeof ROUTES;
