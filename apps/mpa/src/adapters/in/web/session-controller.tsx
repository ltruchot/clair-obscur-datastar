import { HonoSessionAdapter } from '@/adapters/out/session/hono-session-adapter';
import { SessionCommandService } from '@/adapters/out/session/session-command.service';
import { SessionQueryService } from '@/adapters/out/session/session-query.service';
import { closeStream } from '@/infrastructure/datastar-stream';
import type { EventStore } from '@/infrastructure/event-store/event-store.service';
import { type Session } from '@clair-obscur-workspace/domain';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { SESSION_DATASTAR_IDS } from './session-datastar-ids';
import { SessionPage } from './session-page';

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

    c.header('Content-Type', 'text/html; charset=UTF-8');
    return c.html(<SessionPage animalName={animalName} color={color} fontFamily={fontFamily} sessionItems={sessionItems} />);
  }

  async setFont(c: Context) {
    const jsonBody: { font_changed: string } = await c.req.json();
    const persistence = new HonoSessionAdapter(c);
    const session = await this.queryService.getCurrentSession(persistence);
    const splitFont = jsonBody.font_changed.split(':');
    const property = splitFont[0];
    const value = splitFont[1];
    if (!property || !value) {
      return c.json({ success: false, error: 'Invalid font changed' }, 400);
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
              `<strong id="${SESSION_DATASTAR_IDS.MY_SESSION}" style="color:${currentSession.color}; font-family:${currentSession.fontFamily};">${currentSession.animalName.adjective} ${currentSession.animalName.animal}</strong>`,
            );

            stream.patchSignals(JSON.stringify({ items: JSON.stringify(sessionItems) }));
          };

          await sendUpdate();

          unsubscribeStore = this.eventStore.subscribe(() => {
            void sendUpdate();
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
          <strong id="personal-session">an unknown animal</strong>
        `,
        );
        stream.patchSignals(JSON.stringify({ items: JSON.stringify([]) }));
      });
    }
  }

  private async extractSessionListItems(currentSession: Session) {
    const activeSessions = await this.queryService.getActiveSessions();
    const isCurrentSession = (session: Session) => session.id.value === currentSession.id.value;
    return activeSessions.map((session) => ({
      id: session.id.value,
      label: `${session.animalName.adjective} ${session.animalName.animal}`,
      color: session.color,
      fontFamily: session.fontFamily,
      isCurrentSession: isCurrentSession(session),
    }));
  }
}
