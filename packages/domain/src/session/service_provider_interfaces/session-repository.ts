import type { Session, SessionId } from '../session.ts';

export interface SessionRepository {
  findById(id: SessionId): Promise<Session | undefined>;
  save(session: Session): Promise<void>;
  delete(id: SessionId): Promise<void>;
  findAllSessions(): Promise<Session[]>;
}
