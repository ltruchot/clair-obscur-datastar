import type { LevelStoreService } from '@/home/infrastructure/level/level-store.service';

export class LevelCommandService {
  constructor(private readonly levelStore: LevelStoreService) {}

  addHighscore(playerName: string, playerColor: string, playerFont: string): void {
    this.levelStore.addHighscore(playerName, playerColor, playerFont);
  }
}
