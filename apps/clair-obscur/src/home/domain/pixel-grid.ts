export type PixelKey = `${number}-${number}`;

export type PixelValue = 0 | 1;

export type PixelNeighborCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type PixelGuess = -1 | 0 | 1;

export interface PixelInfo {
  v: PixelValue;
  n: PixelNeighborCount;
}

export type PixelData = Record<PixelKey, PixelInfo>;

export type PixelGridData = Record<PixelKey, PixelInfo & { guess: PixelGuess }>;

export interface PixelChange {
  x: number;
  y: number;
  guess: PixelGuess;
  timestamp: number;
}

export interface PixelGridChange {
  pixelGrid: PixelGridData;
  timestamp: number;
}
