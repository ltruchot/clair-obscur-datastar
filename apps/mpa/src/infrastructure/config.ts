import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare const __ENV_RELATIVE_PATH__: string;

config({
  path: path.join(__dirname, __ENV_RELATIVE_PATH__),
});

export const stageEnvironment = process.env.STAGE_ENV ?? 'production';
export const authSecret = process.env.AUTH_SECRET;
export const port = process.env.PORT ?? 3000;

export const isDevelopment = stageEnvironment === 'development';
