import type { SessionId } from '../session.ts';
import { Maybe, just, nothing } from './../../maybe/Maybe.ts';

export class SessionIdFactory {
  static fromString(uuid: string): Maybe<SessionId> {
    if (uuid.trim() === '') {
      return nothing<SessionId>();
    }
    return just<SessionId>({ value: uuid });
  }
}
