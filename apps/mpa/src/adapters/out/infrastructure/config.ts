import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.join(__dirname, '../../../../../../.env'),
});

export const stageEnvironment = process.env.STAGE_ENV ?? 'production';
export const authSecret = process.env.AUTH_SECRET;
export const port = process.env.PORT ?? 3000;

export const isDevelopment = stageEnvironment === 'development';
