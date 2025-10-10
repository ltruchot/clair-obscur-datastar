import {
  Maybe,
  SessionFactory,
  SessionIdFactory,
  type Session,
  type SessionId,
  type SessionPersistence,
  type SessionReadPort,
  type SessionWritePort,
} from '@clair-obscur-workspace/domain';
import { AnimalNameFactory, type AnimalNameGenerator } from '@clair-obscur-workspace/funny-animals-generator';
import type { EventStoreSessionAdapter } from './event-store-session-adapter';

export class SessionCommandService {
  private readonly writePort: SessionWritePort;
  private readonly readPort: SessionReadPort;
  private readonly adapter: EventStoreSessionAdapter;
  private readonly animalNameGenerator: AnimalNameGenerator;

  constructor(
    writePort: SessionWritePort,
    readPort: SessionReadPort,
    adapter: EventStoreSessionAdapter,
    animalNameGenerator: AnimalNameGenerator,
  ) {
    this.writePort = writePort;
    this.readPort = readPort;
    this.adapter = adapter;
    this.animalNameGenerator = animalNameGenerator;
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

        const existingSession = await this.readPort.findById(sessionId);

        if (existingSession) {
          const updatedSession = SessionFactory.updateActivity(existingSession);
          await this.writePort.save(updatedSession);
          return updatedSession;
        }
      }
    } catch {
      persistence.delete();
    }

    const usedNames = this.adapter.getUsedAnimalNames();
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

    const animalKey = AnimalNameFactory.getKey(animalName);
    this.adapter.addUsedAnimalName(animalKey);

    await persistence.update({ id: newSession.id.value });
    await this.writePort.save(newSession);
    return newSession;
  }

  async setColor(persistence: SessionPersistence, color: string): Promise<void> {
    const sessionData = await persistence.get();
    if (sessionData?.id && typeof sessionData.id === 'string') {
      const idString: string = sessionData.id;
      const sessionId: SessionId = SessionIdFactory.fromString(idString).getOrElseValue({ value: '' });
      const existingSession = await this.readPort.findById(sessionId);
      if (existingSession) {
        const updatedSession = { ...existingSession, color };
        await this.writePort.update(updatedSession);
      }
    }
  }

  async trackSession(session: Session): Promise<void> {
    const updatedSession = SessionFactory.updateActivity(session);
    await this.writePort.save(updatedSession);
  }
}
