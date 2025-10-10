import type { Session, SessionId, SessionReadPort } from '@clair-obscur-workspace/domain';

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
}
