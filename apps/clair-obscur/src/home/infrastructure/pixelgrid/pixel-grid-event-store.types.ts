import type { PixelChange, PixelGridData } from '@/home/adapters/in/models/pixels';

export interface PixelGridStoreState {
  pixelGrid: PixelGridData;
}

export interface PixelGridStoreEvent<
  K extends keyof PixelGridStoreState = keyof PixelGridStoreState,
> {
  key: K;
  value: PixelGridStoreState[K];
  timestamp: number;
}

export type PixelGridStoreSubscriber = (state: PixelGridStoreState) => void;

export type PixelLastChangeSubscriber = (lastChange: PixelChange) => void;
export interface PixelUpdate {
  x: number;
  y: number;
  guess: -1 | 0 | 1;
}
