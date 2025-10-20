/**
 * PixelKey represents the hash of a pixel.
 * Useful for storing and retrieving pixels from a record.
 */
export type PixelKey = `${number}-${number}`;

/**
 * PixelValue represents the color of a pixel.
 * 0 represents a black pixel
 * 1 represents a white pixel
 */
export type PixelValue = 0 | 1;

/**
 * PixelNeighborCount represents the number of neighbors of a pixel.
 * 0 represents a pixel with no white neighbors
 * 1+ represents a pixel with one or more white neighbors
 */
export type PixelNeighborCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * PixelGuess represents the guess of a pixel.
 * -1 represents no guess
 * 0 represents a black guess
 * 1 represents a white guess
 */
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
