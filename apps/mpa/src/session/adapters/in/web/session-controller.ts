import { HonoSessionAdapter } from '@/session/adapters/out/session/hono-session-adapter';
import { SessionCommandService } from '@/session/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/session/adapters/out/session/session-query.service';
import type { EventStore } from '@/session/infrastructure/event-store/event-store.service';
import { closeStream } from '@/shared/infrastructure/datastar-stream';
import { type Session } from '@clair-obscur-workspace/domain';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { getListAllSessionsHTMLComponent, SessionItem } from './components/list-all-sessions';
import { DSID, getSessionHTMLPage } from './session-page';
export class SessionController {
  constructor(
    private readonly commandService: SessionCommandService,
    private readonly queryService: SessionQueryService,
    private readonly eventStore: EventStore,
  ) {}

  async renderSessionPage(c: Context): Promise<Response> {
    const persistence = new HonoSessionAdapter(c);
    let session = await this.queryService.getCurrentSession(persistence);

    if (!session) {
      session = await this.commandService.initializeNewSession(persistence);
    } else {
      session = await this.commandService.updateSessionActivity(session);
    }

    const animalName = session?.animalName ? session.animalName.adjective + ' ' + session.animalName.animal : 'an unknown animal';
    const color = session?.color ?? '#000000';
    const fontFamily = session?.fontFamily ?? 'sans-serif';
    const sessionItems = await this.extractSessionListItems(session);

    return c.html(getSessionHTMLPage(animalName, color, fontFamily, sessionItems));
  }

  async setFont(c: Context) {
    const jsonBody: { font_changed: string } = await c.req.json();
    const persistence = new HonoSessionAdapter(c);
    const session = await this.queryService.getCurrentSession(persistence);
    const splitFont = jsonBody.font_changed.split(':');
    const property = splitFont[0];
    const value = splitFont[1];
    if (!property || !value) {
      return c.json({ success: false, error: 'Invalid font change' }, 400);
    }

    if (session) {
      if (property === 'color') {
        await this.commandService.setColor(session, value);
      } else if (property === 'font-family') {
        await this.commandService.setFont(session, value);
      }
    }

    return c.json({ success: true }, 202);
  }

  async keepAlive(c: Context) {
    const persistence = new HonoSessionAdapter(c);
    const session = await this.queryService.getCurrentSession(persistence);
    if (session) {
      await this.commandService.updateSessionActivity(session);
    }
    return c.json({ success: true }, 202);
  }

  broadcastEvents(c: Context): Response {
    const persistence = new HonoSessionAdapter(c);

    let unsubscribeStore: () => void | undefined;
    let currentStream: ServerSentEventGenerator | undefined;

    try {
      return ServerSentEventGenerator.stream(
        async (stream: ServerSentEventGenerator) => {
          currentStream = stream;
          const sendUpdate = async () => {
            const currentSession = await this.queryService.getCurrentSession(persistence);
            if (!currentSession) {
              throw new Error('Current session not found');
            }

            const sessionItems = await this.extractSessionListItems(currentSession);

            stream.patchElements(
              `<strong
                id="${DSID.MY_SESSION}"
                data-on-interval__duration.10s="@post('/keep-alive')"
                style="color:${currentSession.color};
                font-family:${currentSession.fontFamily};">
                  ${currentSession.animalName.adjective} ${currentSession.animalName.animal}
              </strong>`,
            );

            stream.patchElements(getListAllSessionsHTMLComponent(DSID.ALL_SESSIONS, sessionItems));
          };

          const currentSession = await this.queryService.getCurrentSession(persistence);
          if (!currentSession) {
            throw new Error('Current session not found for initial setup');
          }

          await sendUpdate().catch(() => {
            closeStream(stream);
          });

          unsubscribeStore = this.eventStore.subscribe(currentSession.id.value, () => {
            sendUpdate().catch(() => {
              if (stream) {
                closeStream(stream);
              }
              unsubscribeStore?.();
            });
          });
        },
        {
          keepalive: true,
          onAbort: () => {
            unsubscribeStore?.();
            if (currentStream) {
              closeStream(currentStream);
            }
          },
          onError: () => {
            unsubscribeStore?.();
            if (currentStream) {
              closeStream(currentStream);
            }
          },
        },
      );
    } catch {
      return ServerSentEventGenerator.stream((stream) => {
        stream.patchElements(
          `
          <strong id="${DSID.MY_SESSION}">an unknown animal</strong>
         `,
        );
        stream.patchSignals(JSON.stringify({ items: JSON.stringify([]) }));
      });
    }
  }

  private async extractSessionListItems(currentSession: Session): Promise<SessionItem[]> {
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
}
