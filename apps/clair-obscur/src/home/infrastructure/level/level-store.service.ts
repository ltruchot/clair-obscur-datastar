import type { Highscore, Level } from '@/home/domain/level';
import { getLevelConfiguration } from './level-configuration';

const MAX_HIGHSCORES_PER_LEVEL = 10;

export class LevelStoreService {
  private currentLevelIndex = 0;
  private levelHighscores = new Map<number, Highscore[]>();
  private levelStartTimestamp: number | null = null;

  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  getCurrentLevel(): Level {
    const config = getLevelConfiguration(this.currentLevelIndex);
    return {
      ...config,
      highscores: this.getLevelHighscores(this.currentLevelIndex),
    };
  }

  setCurrentLevelIndex(index: number): void {
    this.currentLevelIndex = index;
    this.levelStartTimestamp = Date.now();
  }

  getLevelHighscores(levelIndex: number): Highscore[] {
    return this.levelHighscores.get(levelIndex) ?? [];
  }

  startLevel(): void {
    this.levelStartTimestamp = Date.now();
  }

  addHighscore(playerName: string, playerColor: string, playerFont: string): void {
    if (this.levelStartTimestamp === null) {
      return;
    }

    const durationMs = Date.now() - this.levelStartTimestamp;
    const highscore: Highscore = {
      durationMs,
      playerName,
      playerColor,
      playerFont,
      victoryTimestamp: Date.now(),
    };

    const currentHighscores = this.levelHighscores.get(this.currentLevelIndex) ?? [];
    const updatedHighscores = [...currentHighscores, highscore]
      .sort((a, b) => a.durationMs - b.durationMs)
      .slice(0, MAX_HIGHSCORES_PER_LEVEL);

    this.levelHighscores.set(this.currentLevelIndex, updatedHighscores);
  }

  getAllLevelsWithHighscores(): Level[] {
    const levels: Level[] = [];
    for (let i = 0; i < 3; i++) {
      const config = getLevelConfiguration(i);
      levels.push({
        ...config,
        highscores: this.getLevelHighscores(i),
      });
    }
    return levels;
  }
}
