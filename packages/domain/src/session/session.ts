import type { AnimalName } from './animal-name.ts';

export interface SessionId {
  readonly value: string;
}

export interface Session {
  readonly id: SessionId;
  readonly animalName: AnimalName;
  readonly lastSeen: Date;
  readonly color: string;
  readonly fontFamily: string;
}
