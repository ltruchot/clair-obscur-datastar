import { describe, expect, it } from 'vitest';
import app from './index';

describe('API endpoints', () => {
  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      const response = await app.request('/api/health');
      const json = (await response.json()) as { status: string };

      expect(response.status).toBe(200);
      expect(json).toEqual({ status: 'ok' });
    });
  });
});
