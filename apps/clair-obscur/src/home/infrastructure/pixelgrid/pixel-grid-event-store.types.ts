import type { PixelChange, PixelGridData, PixelGuess } from '@/home/domain/pixel-grid';

export interface PixelGridStoreState {
  pixelGrid: PixelGridData;
}

export interface PixelGridStoreEvent<K extends keyof PixelGridStoreState = keyof PixelGridStoreState> {
  key: K;
  value: PixelGridStoreState[K];
  timestamp: number;
}

export type PixelGridStoreSubscriber = (state: PixelGridStoreState & { victory: boolean }) => void;

export type PixelLastChangeSubscriber = (lastChange: PixelChange) => void;
export interface PixelUpdate {
  x: number;
  y: number;
  guess: PixelGuess;
}
