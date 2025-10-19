import { SessionData } from '@/home/infrastructure/session';
import type { SessionPersistence } from '@clair-obscur-workspace/domain';
import type { Context } from 'hono';

export class HonoSessionAdapter implements SessionPersistence {
  constructor(private readonly context: Context) {}

  get<T = SessionData>(): Promise<T | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.context.var.session.get<T>();
  }

  async update<T = SessionData>(data: T): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.context.var.session.update<T>(data);
  }

  delete(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.context.var.session.delete();
  }
}
