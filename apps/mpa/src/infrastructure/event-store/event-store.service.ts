import type { StoreEvent, StoreState, StoreSubscriber } from './event-store.types.ts';

export class EventStore {
  private state: StoreState = {
    activeSessions: [],
  };

  private subscribers = new Set<StoreSubscriber>();

  write<K extends keyof StoreState>(key: K, value: StoreState[K]): void {
    const event: StoreEvent<K> = {
      key,
      value,
      timestamp: new Date(),
    };

    this.state[event.key] = event.value;

    this.notifySubscribers();
  }

  read(): Readonly<StoreState> {
    return { ...this.state };
  }

  subscribe(subscriber: StoreSubscriber): () => void {
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notifySubscribers(): void {
    const currentState = this.read();
    this.subscribers.forEach((subscriber) => subscriber(currentState));
  }
}
