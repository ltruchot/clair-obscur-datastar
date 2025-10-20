import { BaseLayout } from '@/shared/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
import { PixelData } from '../models/pixels';
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
  pixelData: { pixelGrid: PixelData; timestamp: number };
  victory: boolean;
}

const HomePage: FC<HomePageProps> = ({ animalName, color, fontFamily, sessionItems, pixelData, victory }) => {
  const pixelGridJSON = `'${JSON.stringify(pixelData)}'`;
  const victoryJSON = `'${victory.toString()}'`;
  return (
    <BaseLayout title="Clair Obscur Datastar">
      <div
        class="flex"
        data-on-load="@get('/subscribe-to-events', {openWhenHidden: true})"
        data-signals-_pixelgrid={pixelGridJSON}
        data-signals-_victory={victoryJSON}>
        {/* Session list side */}
        <aside aria-label="Active users">
          <details open>
            <summary></summary>
            <div class="p-10">
              You are a{' '}
              <strong id={DSID.MY_SESSION} style={`color: ${color}; font-family: ${fontFamily};`}>
                {animalName}
              </strong>
              <font-picker
                data-signals-font_changed
                data-on-fontchange="$font_changed = event.detail.value; @post('/font-change')"></font-picker>
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
                <button
                  className="warning"
                  title="This will reset all wrong guesses"
                  data-on-click="confirm('Reset all errored pixels?') ? @post('/cheat-pixel-grid') : null"
                  data-attr-disabled="JSON.parse($_victory)">
                  Cheat
                </button>
                <victory-stars data-attr-won="$_victory.toString()"></victory-stars>
              </menu>
            </details>
          </header>
          <section class="pixel-grid-container">
            <pixel-grid
              id={DSID.PIXEL_GRID}
              data-on-pixelclick="$pixelclick = event.detail; @post('/pixel-click', {requestCancellation: 'disabled'})"
              data-attr-pixels="$_pixelgrid"
              data-attr-last-change="$_lastChange"
              data-attr-victory="$_victory.toString()"></pixel-grid>
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
  pixelData: { pixelGrid: PixelData; timestamp: number },
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
