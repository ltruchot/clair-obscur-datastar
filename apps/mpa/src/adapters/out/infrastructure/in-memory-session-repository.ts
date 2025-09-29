import { AnimalNameFactory } from '../../../domain/entities/animal-name';
import { SessionFactory, type Session, type SessionId } from '../../../domain/entities/session';
import type { SessionRepository } from '../../../domain/ports/session-repository';

export class InMemorySessionRepository implements SessionRepository {
  private sessions = new Map<string, Session>();
  private usedAnimalNames = new Set<string>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => {
      void this.deleteExpired();
    }, 1000);
  }

  findById(id: SessionId): Promise<Session | undefined> {
    const session = this.sessions.get(id.value);
    if (!session) return Promise.resolve(undefined);
    return Promise.resolve(session);
  }

  save(session: Session): Promise<void> {
    this.sessions.set(session.id.value, session);
    const animalKey = AnimalNameFactory.getKey(session.animalName);
    this.usedAnimalNames.add(animalKey);
    return Promise.resolve();
  }

  delete(id: SessionId): Promise<void> {
    const session = this.sessions.get(id.value);
    if (session) {
      const animalKey = AnimalNameFactory.getKey(session.animalName);
      this.usedAnimalNames.delete(animalKey);
    }
    this.sessions.delete(id.value);
    return Promise.resolve();
  }

  findAllSessions(): Promise<Session[]> {
    const activeSessions: Session[] = [];
    for (const session of this.sessions.values()) {
      activeSessions.push(session);
    }

    return Promise.resolve(activeSessions);
  }

  deleteExpired(timeoutMs = 10000): Promise<void> {
    for (const [id, session] of this.sessions.entries()) {
      if (SessionFactory.isExpired(session, timeoutMs)) {
        const animalKey = AnimalNameFactory.getKey(session.animalName);
        this.usedAnimalNames.delete(animalKey);
        this.sessions.delete(id);
      }
    }
    return Promise.resolve();
  }

  getUsedAnimalNames(): Set<string> {
    return new Set(this.usedAnimalNames);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
