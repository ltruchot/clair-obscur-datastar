import type { PixelGridChange } from '@/home/domain/pixel-grid';
import { BaseLayout } from '@/shared/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
import { GameIntroduction } from './components/game-introduction';
import { ListAllSessions, SessionItem } from './components/list-all-sessions';

export const DSID = {
  MY_SESSION: 'my-session',
  ALL_SESSIONS: 'all-sessions',
  PIXEL_GRID: 'pixel-grid',
} as const;

interface HomePageProps {
  animalName: string;
  color: string;
  fontFamily: string;
  sessionItems: SessionItem[];
  pixelData: PixelGridChange;
  victory: boolean;
  defaultDevice: 'mobile' | 'desktop';
}

const HomePage: FC<HomePageProps> = ({
  animalName,
  color,
  fontFamily,
  sessionItems,
  pixelData,
  victory,
  defaultDevice,
}) => {
  const pixelGridJSON = `'${JSON.stringify(pixelData)}'`;
  const victoryJSON = `'${victory.toString()}'`;
  return (
    <BaseLayout title="Clair Obscur Datastar">
      <victory-stars data-attr:won="$_victory.toString()"></victory-stars>
      <div
        data-init="@get('/subscribe-to-events', {openWhenHidden: true})"
        data-signals:_pixelgrid={pixelGridJSON}
        data-signals:_victory={victoryJSON}>
        {/* Session list side */}
        <aside aria-label="Active users">
          <details {...(defaultDevice === 'desktop' ? { open: true } : {})}>
            <summary>
              <span class="aside-menu-icon"></span>
              <font-picker
                data-signals:font_changed
                data-on:fontchange="$font_changed = event.detail.value; @post('/font-change')"></font-picker>
              <button
                aria-label="Cheat"
                title="This will reset all wrong guesses"
                data-on:click="confirm('Reset all errored pixels?') ? @post('/cheat-pixel-grid') : null"
                data-attr:disabled="JSON.parse($_victory)">
                🔮
              </button>
              <button aria-label="High scores" title="This will show the high scores" disabled={true}>
                🏆
              </button>
            </summary>
            <div class="p-10">
              You are{' '}
              <strong id={DSID.MY_SESSION} style={`color: ${color}; font-family: ${fontFamily};`}>
                {animalName}
              </strong>
              <div>All animals on this channel:</div>
              <ListAllSessions id={DSID.ALL_SESSIONS} sessionItems={sessionItems} />
            </div>
          </details>
        </aside>

        {/* Main game side */}
        <main>
          <header>
            <details {...(defaultDevice === 'desktop' ? { open: true } : {})}>
              <summary>
                <h1>
                  <div class="clair">Clair</div>
                  <div class="obscur">Obscur</div>
                </h1>
                <span class="header-collapse-icon"></span>
              </summary>
              <h2>
                Multiplayer minesweeper à la{' '}
                <a href="https://store.steampowered.com/app/3083300/Proverbs/" target="_blank">
                  Proverbs
                </a>
              </h2>
              <div class="header-content-wrapper">
                <GameIntroduction />
                <section aria-label="Game controls">
                  <div class="flex gap-10">
                    <div class="clair">
                      <responsive-content default={defaultDevice}>
                        <span slot="mobile">[1st tap]</span>
                        <strong slot="desktop">[1st click]</strong>
                      </responsive-content>{' '}
                      paints <strong>clair</strong>
                    </div>
                    <div class="obscur">
                      <responsive-content default={defaultDevice}>
                        <span slot="mobile">[2nd tap]</span>
                        <strong slot="desktop">[2nd click]</strong>
                      </responsive-content>{' '}
                      paints <strong>obscur</strong>
                    </div>
                  </div>
                </section>
              </div>
            </details>
          </header>
          <section class="pixel-grid-container">
            <pixel-grid
              id={DSID.PIXEL_GRID}
              data-on:pixelclick="$pixelclick = event.detail; @post('/pixel-click', {requestCancellation: 'disabled'})"
              data-attr:pixels="$_pixelgrid"
              data-attr:last-change="$_lastChange"
              data-attr:victory="$_victory.toString()"></pixel-grid>
          </section>
        </main>
      </div>
    </BaseLayout>
  );
};

export const getHomeHTMLPage = (
  animalName: string,
  color: string,
  fontFamily: string,
  sessionItems: SessionItem[],
  pixelData: PixelGridChange,
  victory: boolean,
  isMobile: boolean,
): string => {
  const defaultDevice: 'mobile' | 'desktop' = isMobile ? 'mobile' : 'desktop';
  return renderToString(
    <HomePage
      animalName={animalName}
      color={color}
      fontFamily={fontFamily}
      sessionItems={sessionItems}
      pixelData={pixelData}
      victory={victory}
      defaultDevice={defaultDevice}
    />,
  );
};
