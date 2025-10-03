import {
  Maybe,
  SessionFactory,
  SessionIdFactory,
  SessionRepository,
  type Session,
  type SessionId,
  type SessionPersistence,
} from '@clair-obscur-workspace/domain';
import type { AnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';
import { InMemorySessionRepository } from './in-memory-session-repository';

export interface SessionService {
  getCurrentSession(persistence: SessionPersistence): Promise<Session>;
  trackSession(session: Session): Promise<void>;
  getActiveSessions(): Promise<Session[]>;
}

export class DefaultSessionService implements SessionService {
  constructor(
    private readonly repository: SessionRepository,
    private readonly animalNameGenerator: AnimalNameGenerator,
  ) {}

  async getCurrentSession(persistence: SessionPersistence): Promise<Session> {
    try {
      const sessionData = await persistence.get();

      if (sessionData?.id && typeof sessionData.id === 'string') {
        const idString: string = sessionData.id;

        const maybeSessionId = SessionIdFactory.fromString(idString);
        const sessionId: SessionId = maybeSessionId.getOrElseValue({ value: '' });
        if (!sessionId.value) {
          throw new Error('Session ID is required');
        }

        const existingSession = await this.repository.findById(sessionId);

        if (existingSession) {
          const updatedSession = SessionFactory.updateActivity(existingSession);
          await this.repository.save(updatedSession);
          return updatedSession;
        }
      }
    } catch {
      persistence.delete();
    }

    const usedNames = (this.repository as InMemorySessionRepository).getUsedAnimalNames();
    const animalName = this.animalNameGenerator.generateUnique(usedNames);
    const maybeNewSession: Maybe<Session> = SessionFactory.create(animalName, crypto.randomUUID());

    const newSession: Session = maybeNewSession.getOrElseValue({
      id: { value: '' },
      animalName: { adjective: '', animal: '' },
      lastSeen: new Date(),
    });
    if (!newSession.id.value) {
      throw new Error('Session ID is required');
    }

    await persistence.update({ id: newSession.id.value });
    await this.repository.save(newSession);
    return newSession;
  }

  async trackSession(session: Session): Promise<void> {
    const updatedSession = SessionFactory.updateActivity(session);
    await this.repository.save(updatedSession);
  }

  async getActiveSessions(): Promise<Session[]> {
    return this.repository.findAllSessions();
  }
}
