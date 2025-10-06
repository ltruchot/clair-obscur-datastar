import type { AnimalName } from '../animal-name.ts';
import type { Session } from '../session.ts';
import { Maybe } from './../../maybe/Maybe.ts';
import { SessionIdFactory } from './session-id-factory.ts';

export class SessionFactory {
  static create(animalName: AnimalName, sessionId: string, color: string): Maybe<Session> {
    const now = new Date();
    return SessionIdFactory.fromString(sessionId).map((id) => ({
      id,
      animalName,
      lastSeen: now,
      color,
    }));
  }

  static updateActivity(session: Session): Session {
    return {
      ...session,
      lastSeen: new Date(),
    };
  }

  static isExpired(session: Session, timeoutMs = 10000): boolean {
    const now = new Date();
    return now.getTime() - session.lastSeen.getTime() > timeoutMs;
  }
}
