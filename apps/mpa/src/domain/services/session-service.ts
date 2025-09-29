import type { InMemorySessionRepository } from '../../adapters/out/infrastructure/in-memory-session-repository';
import type { Session } from '../entities/session';
import { SessionFactory, SessionId as SessionIdFactory } from '../entities/session';
import type { SessionPersistence } from '../ports/session-persistence';
import type { SessionRepository } from '../ports/session-repository';
import type { AnimalNameGenerator } from './animal-name-generator';

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

      if (sessionData?.id) {
        const sessionId = SessionIdFactory.fromString(sessionData.id);
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
    const newSession = SessionFactory.create(animalName);
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
