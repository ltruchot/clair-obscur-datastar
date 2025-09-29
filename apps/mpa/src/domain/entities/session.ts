import type { AnimalName } from '@clair-obscur-workspace/funny-animals-generator';

export interface SessionId {
  readonly value: string;
}

export const SessionId = {
  create(): SessionId {
    return { value: crypto.randomUUID() };
  },

  fromString(value: string): SessionId {
    if (!value.trim()) {
      throw new Error('Session ID cannot be empty');
    }
    return { value };
  },
};

export interface Session {
  readonly id: SessionId;
  readonly animalName: AnimalName;
  readonly lastSeen: Date;
}

export const SessionFactory = {
  create(animalName: AnimalName): Session {
    const now = new Date();
    return {
      id: SessionId.create(),
      animalName,
      lastSeen: now,
    };
  },

  updateActivity(session: Session): Session {
    return {
      ...session,
      lastSeen: new Date(),
    };
  },

  isExpired(session: Session, timeoutMs = 10000): boolean {
    const now = new Date();
    return now.getTime() - session.lastSeen.getTime() > timeoutMs;
  },
};
