import { BaseLayout } from '@/shared/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';
import { ListAllSessions, SessionItem } from './components/list-all-sessions';

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

const pageTitle = 'Clair Obscur';
const crazyStyle =
  'font-size: 36px; width: fit-content; background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;';

const HomePage: FC<HomePageProps> = ({ animalName, color, fontFamily, sessionItems }) => {
  return (
    <BaseLayout title={pageTitle}>
      <h1 data-on-load="@get('/subscribe-to-events')" style={crazyStyle}>
        {pageTitle}
      </h1>
      <div class="flex">
        {/* Main game side */}
        <main class="flex-grow">
          <h2>Main game</h2>
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
    <HomePage animalName={animalName} color={color} fontFamily={fontFamily} sessionItems={sessionItems} />,
  );
};
