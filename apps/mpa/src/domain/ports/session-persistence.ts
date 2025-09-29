export interface SessionData {
  id?: string;
}

export interface SessionPersistence {
  get<T = SessionData>(): Promise<T | undefined>;
  update<T = SessionData>(data: T): Promise<void>;
  delete(): void;
}
