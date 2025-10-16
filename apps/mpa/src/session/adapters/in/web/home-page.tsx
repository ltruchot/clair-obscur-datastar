import { BaseLayout } from '@/shared/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
import { ListAllSessions, SessionItem } from './components/list-all-sessions';

import orcaPixelGrid from '../../../../assets/pixel-grids/orca.json';

export const DSID = {
  MY_SESSION: 'my-session',
  ALL_SESSIONS: 'all-sessions',
} as const;

interface HomePageProps {
  animalName: string;
  color: string;
  fontFamily: string;
  sessionItems: SessionItem[];
}

const pageTitle = 'Clair Obscur Datastar';

const HomePage: FC<HomePageProps> = ({ animalName, color, fontFamily, sessionItems }) => {
  return (
    <BaseLayout title={pageTitle}>
      <div class="flex">
        {/* Main game side */}
        <main class="flex-grow">
          <h1 data-on-load="@get('/subscribe-to-events')">{pageTitle}</h1>
          <h2>A collaborative minesweeper game inpired by Proverbs</h2>
          <pixel-grid pixels={JSON.stringify(orcaPixelGrid)}></pixel-grid>
        </main>

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
