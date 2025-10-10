import type { Session, SessionId } from '../session.ts';

export interface SessionWritePort {
  save(session: Session): Promise<void>;
  update(session: Session): Promise<void>;
  delete(id: SessionId): Promise<void>;
}
