import {
  Maybe,
  SessionFactory,
  SessionIdFactory,
  type Session,
  type SessionId,
  type SessionPersistence,
} from '@clair-obscur-workspace/domain';
import { DefaultAnimalNameGenerator, type AnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';
import { InMemorySessionRepository } from './in-memory-session-repository';

export interface SessionService {
  getCurrentSession(persistence: SessionPersistence): Promise<Session>;
  trackSession(session: Session): Promise<void>;
  getActiveSessions(): Promise<Session[]>;
  setColor(persistence: SessionPersistence, color: string): Promise<void>;
}

export class DefaultSessionService implements SessionService {
  private readonly repository: InMemorySessionRepository;
  private readonly animalNameGenerator: AnimalNameGenerator;
  constructor() {
    this.repository = new InMemorySessionRepository();
    this.animalNameGenerator = new DefaultAnimalNameGenerator();
  }

  async setColor(persistence: SessionPersistence, color: string): Promise<void> {
    const sessionData = await persistence.get();
    if (sessionData?.id && typeof sessionData.id === 'string') {
      const idString: string = sessionData.id;
      const sessionId: SessionId = SessionIdFactory.fromString(idString).getOrElseValue({ value: '' });
      const existingSession = await this.repository.findById(sessionId);
      if (existingSession) {
        const updatedSession = { ...existingSession, color };
        await this.repository.update(updatedSession);
      }
    }
  }

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

    const usedNames = this.repository.getUsedAnimalNames();
    const animalName = this.animalNameGenerator.generateUnique(usedNames);
    const maybeNewSession: Maybe<Session> = SessionFactory.create(animalName, crypto.randomUUID(), '#000000');

    const newSession: Session = maybeNewSession.getOrElseValue({
      id: { value: '' },
      animalName: { adjective: '', animal: '' },
      lastSeen: new Date(),
      color: '',
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
