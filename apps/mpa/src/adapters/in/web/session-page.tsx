import { BaseLayout } from '@/infrastructure/web/base-layout';
import type { FC } from 'hono/jsx';
import { SESSION_DATASTAR_IDS } from './session-datastar-ids';

interface SessionItem {
  id: string;
  label: string;
  color: string;
  fontFamily: string;
  isCurrentSession: boolean;
  isActive: boolean;
}

interface SessionPageProps {
  animalName: string;
  color: string;
  fontFamily: string;
  sessionItems: SessionItem[];
}

const SessionPage: FC<SessionPageProps> = ({ animalName, color, fontFamily, sessionItems }) => {
  return (
    <BaseLayout title="Clair Obscur Datastar">
      <h1 data-on-load="@get('/subscribe-to-events')">Active Sessions</h1>
      You are a{' '}
      <strong id={SESSION_DATASTAR_IDS.MY_SESSION} style={`color: ${color}; font-family: ${fontFamily};`}>
        {animalName}
      </strong>
      <font-picker data-signals-font_changed data-on-fontchange="$font_changed = event.detail.value; @post('/font-change')"></font-picker>
      <hr />
      <div>All animals on this channel:</div>
      <list-element
        id={SESSION_DATASTAR_IDS.SESSIONS}
        data-on-load={`$items = ${JSON.stringify(sessionItems)}`}
        data-attr-items="$items"></list-element>
    </BaseLayout>
  );
};

export const getSessionPageHtml = (animalName: string, color: string, fontFamily: string, sessionItems: SessionItem[]) => {
  return <SessionPage animalName={animalName} color={color} fontFamily={fontFamily} sessionItems={sessionItems} />;
};
