import type { SessionCommandService } from '@/session/adapters/out/session/session-command.service';
import type { SessionQueryService } from '@/session/adapters/out/session/session-query.service';
import { SessionFactory } from '@clair-obscur-workspace/domain';

export class SessionMonitorService {
  private intervalId: NodeJS.Timeout | undefined;

  constructor(
    private readonly queryService: SessionQueryService,
    private readonly commandService: SessionCommandService,
    private readonly checkIntervalMs = 20_000,
    private readonly purgeInactiveDurationMs = 60_000,
  ) {}

  start(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      void this.checkExpiredSessions();
    }, this.checkIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async checkExpiredSessions(): Promise<void> {
    try {
      const allSessions = await this.queryService.getActiveSessions();

      for (const session of allSessions) {
        const inactivityDuration = new Date().getTime() - session.lastSeen.getTime();

        if (inactivityDuration > this.purgeInactiveDurationMs) {
          await this.commandService.deleteSession(session);
        } else if (SessionFactory.isExpired(session, 10000)) {
          const isActive = session.isActive ?? true;
          if (isActive) {
            await this.commandService.deactivateSession(session);
          }
        }
      }
    } catch (error) {
      console.error('Error checking expired sessions:', error);
    }
  }
}
