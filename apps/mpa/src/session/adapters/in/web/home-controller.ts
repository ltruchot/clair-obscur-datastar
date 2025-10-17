import orcaPixelGrid from '@/assets/pixel-grids/orca-enriched.json';
import { SessionCommandService } from '@/session/adapters/out/session/session-command.service';
import type { EventStore } from '@/session/infrastructure/event-store/event-store.service';
import { closeStream } from '@/shared/infrastructure/datastar-stream';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { SessionService } from '../../out/session/session-service';
import { getListAllSessionsHTMLComponent } from './components/list-all-sessions';
import { DSID, getHomeHTMLPage } from './home-page';

export class HomeController {
  constructor(
    private readonly eventStore: EventStore,
    private readonly commandService: SessionCommandService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Populate and render the home page
   * @param c - The Hono context
   * @returns A HTML string representing the home page
   */
  async renderHomePage(c: Context): Promise<Response> {
    const session = await this.sessionService.getOrCreateCurrentSession(c);

    const { animalName, color, fontFamily } = this.sessionService.extractSessionData(session);
    const sessionItems = await this.sessionService.extractSessionListItems(session);

    return c.html(getHomeHTMLPage(animalName, color, fontFamily, sessionItems, orcaPixelGrid));
  }

  /**
   * Set the font for the current session
   * @param c - The Hono context
   * @returns A JSON response with a success message
   */
  async setFont(c: Context): Promise<Response> {
    const { error } = await this.sessionService.setFont(c);
    if (error) {
      return c.json({ success: false, error }, 400);
    }
    return c.json({ success: true }, 202);
  }

  /**
   * Update session activity to prevent session expiration
   * Should be called regularly by each client
   * @param c - The Hono context
   * @returns A JSON response with a success message
   */
  async keepAlive(c: Context): Promise<Response> {
    const session = await this.sessionService.getCurrentSession(c);
    if (session) {
      await this.commandService.updateSessionActivity(session);
    }
    return c.json({ success: true }, 202);
  }

  broadcastEvents(c: Context): Response {
    let unsubscribeStore: () => void | undefined;
    let currentStream: ServerSentEventGenerator | undefined;

    try {
      return ServerSentEventGenerator.stream(
        async (stream: ServerSentEventGenerator) => {
          currentStream = stream;
          const sendUpdate = async () => {
            const currentSession = await this.sessionService.getCurrentSession(c);
            if (!currentSession) {
              throw new Error('Current session not found');
            }

            const sessionItems = await this.sessionService.extractSessionListItems(currentSession);

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

          const currentSession = await this.sessionService.getCurrentSession(c);
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
}
