import minesweeperPixelGrid from '@/assets/pixel-grids/minesweeper-enriched.json';
import orcaPixelGrid from '@/assets/pixel-grids/orca-enriched.json';
import spaceInvaderPixelGrid from '@/assets/pixel-grids/space-invader-enriched.json';
import type { Level } from '@/home/domain/level';
import type { PixelData } from '@/home/domain/pixel-grid';

export const LEVEL_CONFIGURATIONS: readonly Level[] = [
  {
    index: 0,
    clue: 'Boom!',
    pixelData: minesweeperPixelGrid as PixelData,
  },
  {
    index: 1,
    clue: 'From Space',
    pixelData: spaceInvaderPixelGrid as PixelData,
  },
  {
    index: 2,
    clue: 'Seal Eater',
    pixelData: orcaPixelGrid as PixelData,
  },
] as const;

export function getLevelCount(): number {
  return LEVEL_CONFIGURATIONS.length;
}

export function getLevelConfiguration(index: number): Level {
  const normalizedIndex = index % LEVEL_CONFIGURATIONS.length;
  return LEVEL_CONFIGURATIONS[normalizedIndex];
}

export function getNextLevelIndex(currentIndex: number): number {
  return (currentIndex + 1) % LEVEL_CONFIGURATIONS.length;
}
