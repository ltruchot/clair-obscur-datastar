import {
  Maybe,
  SessionFactory,
  type Session,
  type SessionPersistence,
  type SessionWritePort,
} from '@clair-obscur-workspace/domain';
import {
  AnimalNameFactory,
  type AnimalNameGenerator,
} from '@clair-obscur-workspace/funny-animals-generator';
import type { EventStoreSessionAdapter } from './event-store-session-adapter';

export class SessionCommandService {
  private readonly writePort: SessionWritePort;
  private readonly adapter: EventStoreSessionAdapter;
  private readonly animalNameGenerator: AnimalNameGenerator;

  constructor(
    writePort: SessionWritePort,
    adapter: EventStoreSessionAdapter,
    animalNameGenerator: AnimalNameGenerator,
  ) {
    this.writePort = writePort;
    this.adapter = adapter;
    this.animalNameGenerator = animalNameGenerator;
  }

  async initializeNewSession(persistence: SessionPersistence): Promise<Session> {
    const usedNames = this.adapter.getUsedAnimalNames();
    const animalName = this.animalNameGenerator.generateUnique(usedNames);
    const maybeNewSession: Maybe<Session> = SessionFactory.create(
      crypto.randomUUID(),
      animalName,
      '#000000',
      'sans-serif',
    );

    const newSession: Session = maybeNewSession.getOrElseValue({
      id: { value: '' },
      animalName: { adjective: '', animal: '' },
      lastSeen: new Date(),
      color: '',
      fontFamily: 'sans-serif',
      isActive: true,
    });

    if (!newSession.id.value) {
      throw new Error('Session ID is required');
    }

    const animalKey = AnimalNameFactory.getKey(animalName);
    this.adapter.addUsedAnimalName(animalKey);

    await persistence.update({ id: newSession.id.value });
    await this.writePort.save(newSession);
    return newSession;
  }

  async updateSessionActivity(session: Session): Promise<Session> {
    const updatedSession = SessionFactory.updateActivity(session);
    await this.writePort.save(updatedSession);
    return updatedSession;
  }

  async setColor(session: Session, color: string): Promise<void> {
    const updatedSession = { ...session, color };
    await this.writePort.update(updatedSession);
  }

  async setFont(session: Session, fontFamily: string): Promise<void> {
    const updatedSession = { ...session, fontFamily };
    await this.writePort.update(updatedSession);
  }

  async deactivateSession(session: Session): Promise<void> {
    const deactivatedSession = { ...session, isActive: false };
    await this.writePort.update(deactivatedSession);
  }

  async deleteSession(session: Session): Promise<void> {
    const animalKey = AnimalNameFactory.getKey(session.animalName);
    this.adapter.removeUsedAnimalName(animalKey);
    await this.writePort.delete(session.id);
  }
}
