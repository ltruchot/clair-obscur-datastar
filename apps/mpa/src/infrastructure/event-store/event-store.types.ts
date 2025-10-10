import type { Session } from '@clair-obscur-workspace/domain';

export interface StoreState {
  activeSessions: Session[];
}

export interface StoreEvent<K extends keyof StoreState = keyof StoreState> {
  key: K;
  value: StoreState[K];
  timestamp: Date;
}

export type StoreSubscriber = (state: StoreState) => void;
