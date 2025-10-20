import { isDevelopment } from '@/shared/infrastructure/config';
import type { Session } from '@clair-obscur-workspace/domain';
import type { StoreEvent, StoreState, StoreSubscriber } from './session-event-store.types.js';

type SessionObservableFields = Omit<keyof Session, 'id' | 'lastSeen'>;

export class SessionEventStore {
  private readonly observableFields: SessionObservableFields[] = ['color', 'fontFamily', 'animalName', 'isActive'];

  private state: StoreState = {
    activeSessions: [],
  };

  private previousState: StoreState = {
    activeSessions: [],
  };

  private subscribers = new Map<string, StoreSubscriber>();

  write<K extends keyof StoreState>(key: K, value: StoreState[K]): void {
    const event: StoreEvent<K> = {
      key,
      value,
      timestamp: new Date().getTime(),
    };

    this.previousState = { ...this.state };
    this.state[event.key] = event.value;

    this.notifySubscribers();
  }

  read(): Readonly<StoreState> {
    return { ...this.state };
  }

  subscribe(sessionId: string, subscriber: StoreSubscriber): () => void {
    this.subscribers.set(sessionId, subscriber);

    return () => {
      this.subscribers.delete(sessionId);
    };
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  private hasRelevantChanges(): boolean {
    const currentSessions = this.state.activeSessions;
    const previousSessions = this.previousState.activeSessions;

    if (currentSessions.length !== previousSessions.length) {
      if (isDevelopment) {
        console.info('[SessionEventStore] Length changed:', previousSessions.length, '→', currentSessions.length);
      }
      return true;
    }

    for (const currentSession of currentSessions) {
      const previousSession = previousSessions.find((s) => s.id.value === currentSession.id.value);

      if (!previousSession) {
        if (isDevelopment) {
          console.info('[SessionEventStore] New session:', currentSession.id.value);
        }
        return true;
      }

      for (const field of this.observableFields) {
        if (this.hasFieldChanged(currentSession, previousSession, field)) {
          if (isDevelopment) {
            console.info(
              '[SessionEventStore] Field changed:',
              field,
              'for session:',
              currentSession.id.value,
              'previous:',
              JSON.stringify(previousSession[field as keyof Session]),
              'current:',
              JSON.stringify(currentSession[field as keyof Session]),
            );
          }
          return true;
        }
      }
    }

    return false;
  }

  private hasFieldChanged(current: Session, previous: Session, field: SessionObservableFields): boolean {
    if (field === 'animalName') {
      return (
        current.animalName.adjective !== previous.animalName.adjective ||
        current.animalName.animal !== previous.animalName.animal
      );
    }
    return current[field as keyof Session] !== previous[field as keyof Session];
  }

  private notifySubscribers(): void {
    if (!this.hasRelevantChanges()) {
      return;
    }

    const currentState = this.read();
    this.subscribers.forEach((subscriber) => subscriber(currentState));
  }
}
