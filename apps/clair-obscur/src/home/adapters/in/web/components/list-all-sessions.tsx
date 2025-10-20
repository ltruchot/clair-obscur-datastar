import { Session } from '@clair-obscur-workspace/domain';
import type { FC } from 'hono/jsx';
import { renderToString } from 'hono/jsx/dom/server';

export interface SessionItem extends Omit<Session, 'animalName' | 'id'> {
  id: string;
  label: string;
  isCurrentSession: boolean;
}

interface SessionPageProps {
  id: string;
  sessionItems: SessionItem[];
}

export const ListAllSessions: FC<SessionPageProps> = ({ sessionItems, id }) => {
  return (
    <ul id={id}>
      {sessionItems.map((session) => (
        <li
          style={`color: ${session.color}; font-family: ${session.fontFamily}; ${session.isActive ? '' : 'opacity: 0.4; text-decoration: line-through;'}`}
          key={session.id}>
          {session.label} {session.isCurrentSession ? '(you)' : ''}
        </li>
      ))}
    </ul>
  );
};

export const getListAllSessionsHTMLComponent = (id: string, sessionItems: SessionItem[]): string => {
  return renderToString(<ListAllSessions sessionItems={sessionItems} id={id} />);
};
