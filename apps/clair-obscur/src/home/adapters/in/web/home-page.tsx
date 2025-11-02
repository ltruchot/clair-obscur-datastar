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
}

const HomePage: FC<HomePageProps> = ({ animalName, color, fontFamily, sessionItems, pixelData, victory }) => {
  const pixelGridJSON = `'${JSON.stringify(pixelData)}'`;
  const victoryJSON = `'${victory.toString()}'`;
  return (
    <BaseLayout title="Clair Obscur Datastar">
      <div
        class="flex"
        data-init="@get('/subscribe-to-events', {openWhenHidden: true})"
        data-signals:_pixelgrid={pixelGridJSON}
        data-signals:_victory={victoryJSON}>
        {/* Session list side */}
        <aside aria-label="Active users">
          <details open>
            <summary>
              <span class="aside-menu-icon"></span>
              <font-picker
                data-signals:font_changed
                data-on:fontchange="$font_changed = event.detail.value; @post('/font-change')"></font-picker>
            </summary>
            <div class="p-10">
              You are a{' '}
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
            <details open>
              <summary></summary>
              <GameIntroduction />
              <menu>
                <div class="flex gap-10">
                  <div class="clair">
                    <responsive-content>
                      <span slot="mobile">[1st tap]</span>
                      <strong slot="desktop">[1st click]</strong>
                    </responsive-content>{' '}
                    paint in <strong>clair</strong>
                  </div>
                  <div class="obscur">
                    <responsive-content>
                      <span slot="mobile">[2nd tap]</span>
                      <strong slot="desktop">[2nd click]</strong>
                    </responsive-content>{' '}
                    paint in <strong>obscur</strong>
                  </div>
                </div>
                <button
                  title="This will reset all wrong guesses"
                  data-on:click="confirm('Reset all errored pixels?') ? @post('/cheat-pixel-grid') : null"
                  data-attr:disabled="JSON.parse($_victory)">
                  Cheat
                </button>
                <button
                  class="coral"
                  title="This will show"
                  data-on:click="confirm('Reset all errored pixels?') ? @post('/cheat-pixel-grid') : null"
                  data-attr:disabled="JSON.parse($_victory)">
                  High scores
                </button>
                <victory-stars data-attr:won="$_victory.toString()"></victory-stars>
              </menu>
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
): string => {
  return renderToString(
    <HomePage
      animalName={animalName}
      color={color}
      fontFamily={fontFamily}
      sessionItems={sessionItems}
      pixelData={pixelData}
      victory={victory}
    />,
  );
};
