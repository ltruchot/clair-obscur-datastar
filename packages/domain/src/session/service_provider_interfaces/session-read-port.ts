import type { Session, SessionId } from '../session.ts';

export interface SessionReadPort {
  findById(id: SessionId): Promise<Session | undefined>;
  findAllSessions(): Promise<Session[]>;
}
