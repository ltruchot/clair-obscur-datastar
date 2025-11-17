import { LevelQueryService } from '@/home/adapters/out/level/level-query.service';
import { PixelGridCommandService } from '@/home/adapters/out/pixelgrid/pixelgrid-command.service';
import { PixelGridQueryService } from '@/home/adapters/out/pixelgrid/pixelgrid-query.service';
import { SessionCommandService } from '@/home/adapters/out/session/session-command.service';
import type { PixelChange } from '@/home/domain/pixel-grid';
import { PixelGridEventStore } from '@/home/infrastructure/pixelgrid/pixel-grid-event-store.service';
import { SessionEventStore } from '@/home/infrastructure/session/session-event-store.service';
import { closeStream } from '@/shared/infrastructure/datastar-stream';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import type { Context } from 'hono';
import { SessionService } from '../../out/session/session-service';
import { getListAllSessionsHTMLComponent } from './components/list-all-sessions';
import { DSID, getHomeHTMLPage } from './home-page';

export class HomeController {
  constructor(
    private readonly sessionEventStore: SessionEventStore,
    private readonly commandService: SessionCommandService,
    private readonly sessionService: SessionService,
    private readonly pixelGridEventStore: PixelGridEventStore,
    private readonly pixelGridQueryService: PixelGridQueryService,
    private readonly pixelGridCommandService: PixelGridCommandService,
    private readonly levelQueryService: LevelQueryService,
  ) {}

  /**
   * Detect if the user is on a mobile device using modern Client Hints with User-Agent fallback
   * @param c - The Hono context
   * @returns true if mobile, false if desktop
   */
  private detectMobileDevice(c: Context): boolean {
    const clientHintMobile = c.req.header('sec-ch-ua-mobile');
    if (clientHintMobile !== undefined) {
      return clientHintMobile === '?1';
    }

    const userAgent = c.req.header('user-agent') ?? '';
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  /**
   * Populate and render the home page
   * @param c - The Hono context
   * @returns A HTML string representing the home page
   */
  async renderHomePage(c: Context): Promise<Response> {
    const session = await this.sessionService.getOrCreateCurrentSession(c);

    const { animalName, color, fontFamily } = this.sessionService.extractSessionData(session);
    const sessionItems = await this.sessionService.extractSessionListItems(session);
    const pixelData = { pixelGrid: this.pixelGridQueryService.getPixelGrid(), timestamp: new Date().getTime() };
    const victory = this.pixelGridQueryService.checkVictory();
    const isMobile = this.detectMobileDevice(c);
    const currentLevel = this.levelQueryService.getCurrentLevel();

    return c.html(
      getHomeHTMLPage(animalName, color, fontFamily, sessionItems, pixelData, victory, isMobile, currentLevel),
    );
  }

  broadcastEvents(c: Context): Response {
    let unsubscribeSessionStore: () => void | undefined;
    let unsubscribePixelGridStore: () => void | undefined;
    let unsubscribePixelGridStoreLastChange: () => void | undefined;
    let currentStream: ServerSentEventGenerator | undefined;

    try {
      return ServerSentEventGenerator.stream(
        async (stream: ServerSentEventGenerator) => {
          currentStream = stream;

          const sendSessionUpdate = async () => {
            const currentSession = await this.sessionService.getCurrentSession(c);
            if (!currentSession) {
              throw new Error('Current session not found');
            }

            stream.patchElements(
              `<strong
                id="${DSID.MY_SESSION}"
                data-on-interval__duration.10s="@post('/keep-alive', {openWhenHidden: true})"
                style="color:${currentSession.color};
                font-family:${currentSession.fontFamily};">
                  ${currentSession.animalName.adjective} ${currentSession.animalName.animal}
              </strong>`,
            );

            const sessionItems = await this.sessionService.extractSessionListItems(currentSession);
            stream.patchElements(getListAllSessionsHTMLComponent(DSID.ALL_SESSIONS, sessionItems));
          };

          const currentSession = await this.sessionService.getCurrentSession(c);
          if (!currentSession) {
            throw new Error('Current session not found for initial setup');
          }

          await sendSessionUpdate().catch(() => {
            closeStream(stream);
          });

          unsubscribePixelGridStore = this.pixelGridEventStore.subscribe(currentSession.id.value, (state) => {
            const pixelData = JSON.stringify({
              pixelGrid: state.pixelGrid,
              timestamp: new Date().getTime(),
            }).replace(/"/g, '&quot;');

            const pixelGridElement = `<pixel-grid
              id="${DSID.PIXEL_GRID}"
              data-preserve-attr="data-on:pixelclick data-attr:last-change data-attr:victory"
              data-attr:pixels="${pixelData}"></pixel-grid>
              <div id="level-info">
                <strong>Level ${this.levelQueryService.getCurrentLevelIndex() + 1}</strong>: ${this.levelQueryService.getCurrentLevel().clue}
              </div>`;

            stream.patchElements(pixelGridElement);

            stream.patchSignals(
              JSON.stringify({
                _lastChange: { x: -1, y: -1, guess: -1, timestamp: new Date().getTime() },
                _victory: state.victory,
              }),
            );
          });

          unsubscribePixelGridStoreLastChange = this.pixelGridEventStore.subscribeLastChange(
            currentSession.id.value,
            (lastChange: PixelChange) => {
              const victory = this.pixelGridQueryService.checkVictory();
              stream.patchSignals(JSON.stringify({ _lastChange: lastChange, _victory: victory }));
            },
          );

          unsubscribeSessionStore = this.sessionEventStore.subscribe(currentSession.id.value, () => {
            sendSessionUpdate().catch(() => {
              if (stream) {
                closeStream(stream);
              }
              unsubscribeSessionStore?.();
              unsubscribePixelGridStore?.();
              unsubscribePixelGridStoreLastChange?.();
            });
          });
        },
        {
          keepalive: true,
          onAbort: () => {
            unsubscribeSessionStore?.();
            unsubscribePixelGridStore?.();
            unsubscribePixelGridStoreLastChange?.();
            if (currentStream) {
              closeStream(currentStream);
            }
          },
          onError: () => {
            unsubscribeSessionStore?.();
            unsubscribePixelGridStore?.();
            unsubscribePixelGridStoreLastChange?.();
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
        stream.patchSignals(JSON.stringify({ items: [] }));
      });
    }
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

  /**
   * Set the font for the current session
   * @param c - The Hono context
   * @returns A JSON response with a success message
   */
  async setFont(c: Context): Promise<Response> {
    const jsonBody: { font_changed: string } = await c.req.json();
    const { error } = await this.sessionService.setFont(c, jsonBody.font_changed);
    if (error) {
      return c.json({ success: false, error }, 400);
    }
    return c.json({ success: true }, 202);
  }

  async updatePixel(c: Context): Promise<Response> {
    try {
      const jsonBody: { pixelclick: { x: number; y: number; guess: -1 | 0 | 1 } } = await c.req.json();
      const { x, y, guess } = jsonBody.pixelclick;

      if (typeof x !== 'number' || typeof y !== 'number') {
        return c.json({ success: false, error: 'Invalid coordinates' }, 400);
      }

      if (guess !== -1 && guess !== 0 && guess !== 1) {
        return c.json({ success: false, error: 'Invalid guess value' }, 400);
      }

      this.pixelGridCommandService.updatePixelGuess(x, y, guess);

      return c.json({ success: true }, 202);
    } catch {
      return c.json({ success: false, error: 'Invalid request' }, 400);
    }
  }

  resetPixelGrid(c: Context): Response {
    this.pixelGridCommandService.resetPixelGrid();
    return c.json({ success: true }, 202);
  }

  cheatPixelGrid(c: Context): Response {
    this.pixelGridCommandService.cheatPixelGrid();
    return c.json({ success: true }, 202);
  }

  almostWinLevel(c: Context): Response {
    this.pixelGridCommandService.almostWinLevel();
    return c.json({ success: true }, 202);
  }

  nextLevel(c: Context): Response {
    this.pixelGridCommandService.nextLevel();
    return c.json({ success: true }, 202);
  }
}
