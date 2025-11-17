import type { Level } from '@/home/domain/level';
import type { LevelStoreService } from '@/home/infrastructure/level/level-store.service';

export class LevelQueryService {
  constructor(private readonly levelStore: LevelStoreService) {}

  getCurrentLevel(): Level {
    return this.levelStore.getCurrentLevel();
  }

  getCurrentLevelIndex(): number {
    return this.levelStore.getCurrentLevelIndex();
  }
}
