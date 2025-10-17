import { BaseLayout } from '@/shared/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
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
}

const HomePage: FC<HomePageProps> = ({ animalName, color, fontFamily, sessionItems }) => {
  return (
    <BaseLayout title="Clair Obscur Datastar">
      <div class="flex">
        {/* Session list side */}
        <aside aria-label="Active users">
          You are a{' '}
          <strong id={DSID.MY_SESSION} style={`color: ${color}; font-family: ${fontFamily};`}>
            {animalName}
          </strong>
          <font-picker
            data-signals-font_changed
            data-on-fontchange="$font_changed = event.detail.value; @post('/font-change')"></font-picker>
          <hr />
          <div>All animals on this channel:</div>
          <ListAllSessions id={DSID.ALL_SESSIONS} sessionItems={sessionItems} />
        </aside>

        {/* Main game side */}
        <main class="flex-grow">
          <h1 data-on-load="@get('/subscribe-to-events')">
            <span class="clair">Clair&nbsp;</span>
            <span class="obscur">&nbsp;Obscur</span>:<span class="rainbow"> Datastar</span>
          </h1>
          <h2>
            A collaborative minesweeper game inspired by{' '}
            <a href="https://store.steampowered.com/app/3083300/Proverbs/" target="_blank">
              Proverbs
            </a>
          </h2>
          <p>
            <strong>Numbers</strong> indicate how many{' '}
            <strong class="clair">clair pixels (white)</strong> surround the current pixel,
            including itself. (e.g. a 9 indicate that <span class="clair">9 clair</span> pixels
            surround the current pixel)
            <br />
            <span class="obscur">
              Left click to paint a pixel in <strong>obscur</strong> (black)
            </span>{' '}
            -{' '}
            <span class="clair">
              Right click to paint a pixel in <strong>clair</strong> (white)
            </span>
            <br />
          </p>
          <pixel-grid
            id={DSID.PIXEL_GRID}
            data-signals-pixelclick
            data-signals-pixelGrid
            data-on-pixelhover="console.log('pixel hovered', event.detail)"
            data-on-pixelclick="$pixelclick = event.detail; @post('/pixel-click')"
            data-attr-pixels="$pixelGrid"></pixel-grid>
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
): string => {
  return renderToString(
    <HomePage
      animalName={animalName}
      color={color}
      fontFamily={fontFamily}
      sessionItems={sessionItems}
    />,
  );
};
