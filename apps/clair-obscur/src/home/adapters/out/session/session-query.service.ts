import {
  SessionIdFactory,
  type Session,
  type SessionId,
  type SessionPersistence,
  type SessionReadPort,
} from '@clair-obscur-workspace/domain';

export class SessionQueryService {
  private readonly readPort: SessionReadPort;

  constructor(readPort: SessionReadPort) {
    this.readPort = readPort;
  }

  getActiveSessions(): Promise<Session[]> {
    return this.readPort.findAllSessions();
  }

  findSessionById(id: SessionId): Promise<Session | undefined> {
    return this.readPort.findById(id);
  }

  async getCurrentSession(persistence: SessionPersistence): Promise<Session | undefined> {
    try {
      const sessionData = await persistence.get();

      if (sessionData?.id && typeof sessionData.id === 'string') {
        const idString: string = sessionData.id;
        const maybeSessionId = SessionIdFactory.fromString(idString);
        const sessionId: SessionId = maybeSessionId.getOrElseValue({ value: '' });

        if (!sessionId.value) {
          return undefined;
        }

        return await this.readPort.findById(sessionId);
      }
    } catch {
      persistence.delete();
    }

    return undefined;
  }
}
