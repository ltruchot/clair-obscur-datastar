import { SessionEventStore } from '@/home/infrastructure/session/session-event-store.service';
import type {
  Session,
  SessionId,
  SessionReadPort,
  SessionWritePort,
} from '@clair-obscur-workspace/domain';

export class EventStoreSessionAdapter implements SessionReadPort, SessionWritePort {
  private usedAnimalNames = new Set<string>();

  constructor(private readonly eventStore: SessionEventStore) {}

  findById(id: SessionId): Promise<Session | undefined> {
    const state = this.eventStore.read();
    return Promise.resolve(state.activeSessions.find((session) => session.id.value === id.value));
  }

  findAllSessions(): Promise<Session[]> {
    const state = this.eventStore.read();
    return Promise.resolve([...state.activeSessions]);
  }

  save(session: Session): Promise<void> {
    const state = this.eventStore.read();
    const existingIndex = state.activeSessions.findIndex((s) => s.id.value === session.id.value);

    let updatedSessions: Session[];
    if (existingIndex >= 0) {
      updatedSessions = [...state.activeSessions];
      updatedSessions[existingIndex] = session;
    } else {
      updatedSessions = [...state.activeSessions, session];
    }

    this.eventStore.write('activeSessions', updatedSessions);
    return Promise.resolve();
  }

  update(session: Session): Promise<void> {
    return this.save(session);
  }

  delete(id: SessionId): Promise<void> {
    const state = this.eventStore.read();
    const updatedSessions = state.activeSessions.filter((s) => s.id.value !== id.value);
    this.eventStore.write('activeSessions', updatedSessions);
    return Promise.resolve();
  }

  getUsedAnimalNames(): Set<string> {
    return new Set(this.usedAnimalNames);
  }

  addUsedAnimalName(key: string): void {
    this.usedAnimalNames.add(key);
  }

  removeUsedAnimalName(key: string): void {
    this.usedAnimalNames.delete(key);
  }
}
