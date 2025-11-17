import type { Level } from '@/home/domain/level';
import { getLevelConfiguration } from './level-configuration';

export class LevelStoreService {
  private currentLevelIndex = 0;

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  getCurrentLevel(): Level {
    return getLevelConfiguration(this.currentLevelIndex);
  }

  setCurrentLevelIndex(index: number): void {
    this.currentLevelIndex = index;
  }
}
