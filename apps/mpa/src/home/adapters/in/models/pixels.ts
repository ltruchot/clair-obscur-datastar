export type PixelData = Record<
  `${number}-${number}`,
  { v: boolean; n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }
>;

export type PixelGridData = Record<
  `${number}-${number}`,
  { v: boolean; n: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; guess: -1 | 0 | 1 }
>;
