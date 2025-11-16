import type { SessionCommandService } from '@/home/adapters/out/session/session-command.service';
import type { SessionQueryService } from '@/home/adapters/out/session/session-query.service';

export class SessionMonitorService {
  private intervalId: NodeJS.Timeout | undefined;

  constructor(
    private readonly queryService: SessionQueryService,
    private readonly commandService: SessionCommandService,
    private readonly checkIntervalMs = 5_000, // 5 seconds
    private readonly deactivationDurationMs = 10_000, // 10 seconds
    private readonly purgeInactiveDurationMs = 24 * 60 * 1000, // 30 days
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
        } else if (inactivityDuration > this.deactivationDurationMs) {
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
