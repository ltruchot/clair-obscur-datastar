// external packages
import { Context } from 'hono';

// monorepo packages
import { Session } from '@clair-obscur-workspace/domain';

// local packages
import { SessionItem } from '@/session/adapters/in/web/components/list-all-sessions';
import { HonoSessionAdapter } from '@/session/adapters/out/session/hono-session-adapter';
import { SessionCommandService } from '@/session/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/session/adapters/out/session/session-query.service';

export class SessionService {
  constructor(
    private readonly queryService: SessionQueryService,
    private readonly commandService: SessionCommandService,
  ) {}

  async getOrCreateCurrentSession(c: Context): Promise<Session> {
    const persistence = new HonoSessionAdapter(c);
    let session = await this.queryService.getCurrentSession(persistence);

    if (!session) {
      session = await this.commandService.initializeNewSession(persistence);
    } else {
      session = await this.commandService.updateSessionActivity(session);
    }
    return session;
  }
  async getCurrentSession(c: Context): Promise<Session | undefined> {
    const persistence = new HonoSessionAdapter(c);
    return this.queryService.getCurrentSession(persistence);
  }

  extractSessionData(session: Session): { animalName: string; color: string; fontFamily: string } {
    // extract session data
    const animalName = session?.animalName
      ? session.animalName.adjective + ' ' + session.animalName.animal
      : 'an unknown animal';
    const color = session?.color ?? '#000000';
    const fontFamily = session?.fontFamily ?? 'sans-serif';
    return {
      animalName,
      color,
      fontFamily,
    };
  }

  async extractSessionListItems(currentSession: Session): Promise<SessionItem[]> {
    const activeSessions = await this.queryService.getActiveSessions();
    const isCurrentSession = (session: Session) => session.id.value === currentSession.id.value;
    return activeSessions.map((session) => ({
      id: session.id.value,
      lastSeen: session.lastSeen,
      label: `${session.animalName.adjective} ${session.animalName.animal}`,
      color: session.color,
      fontFamily: session.fontFamily,
      isCurrentSession: isCurrentSession(session),
      isActive: session.isActive ?? true,
    }));
  }

  async setFont(c: Context): Promise<{ error?: string }> {
    const jsonBody: { font_changed: string } = await c.req.json();
    const persistence = new HonoSessionAdapter(c);
    const session = await this.queryService.getCurrentSession(persistence);
    const splitFont = jsonBody.font_changed.split(':');
    const property = splitFont[0];
    const value = splitFont[1];
    if (!property || !value) {
      return { error: 'Invalid font change' };
    }

    if (session) {
      if (property === 'color') {
        await this.commandService.setColor(session, value);
      } else if (property === 'font-family') {
        await this.commandService.setFont(session, value);
      }
    }
    return { error: undefined };
  }
}
