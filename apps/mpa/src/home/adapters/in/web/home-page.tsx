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
  pixelGrid: PixelData;
}

const HomePage: FC<HomePageProps> = ({
  animalName,
  color,
  fontFamily,
  sessionItems,
  pixelGrid,
}) => {
  return (
    <BaseLayout title="Clair Obscur Datastar">
      {/* Victory message
      <div data-show="$victory">
        <div className="victory">VICTORY !!!</div>
      </div>
       */}

      <div class="flex" data-on-load="@get('/subscribe-to-events')">
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
          <GameIntroduction />

          <pixel-grid
            id={DSID.PIXEL_GRID}
            data-on-pixelhover="console.log('pixel hovered', event.detail)"
            data-on-pixelclick="$pixelclick = event.detail; @post('/pixel-click', {requestCancellation: 'disabled'})"
            pixels={JSON.stringify(pixelGrid)}
            data-attr-last-change="$_LastChange"></pixel-grid>
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
  pixelGrid: PixelData,
): string => {
  return renderToString(
    <HomePage
      animalName={animalName}
      color={color}
      fontFamily={fontFamily}
      sessionItems={sessionItems}
      pixelGrid={pixelGrid}
    />,
  );
};
