import type { AnimalName } from './animal-name.ts';
import { ADJECTIVES, AnimalNameFactory, ANIMALS } from './animal-name.ts';

export interface AnimalNameGenerator {
  generateUnique(usedNames: Set<string>): AnimalName;
  isAvailable(animalName: AnimalName, usedNames: Set<string>): boolean;
}

export class DefaultAnimalNameGenerator implements AnimalNameGenerator {
  private readonly maxAttempts = 1000;

  generateUnique(usedNames: Set<string>): AnimalName {
    const totalCombinations = ADJECTIVES.length * ANIMALS.length;

    // If all combinations are exhausted, return first animal name
    if (usedNames.size >= totalCombinations) {
      return AnimalNameFactory.create();
    }

    for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
      const candidate = AnimalNameFactory.random();
      const key = AnimalNameFactory.getKey(candidate);

      if (!usedNames.has(key)) {
        return candidate;
      }
    }

    // Fallback: iterate through all combinations to find available one
    for (const adjective of ADJECTIVES) {
      for (const animal of ANIMALS) {
        const candidate = AnimalNameFactory.create(adjective, animal);
        const key = AnimalNameFactory.getKey(candidate);

        if (!usedNames.has(key)) {
          return candidate;
        }
      }
    }

    // Fallback: return firsts animal name if something went wrong
    return AnimalNameFactory.create();
  }

  isAvailable(animalName: AnimalName, usedNames: Set<string>): boolean {
    const key = AnimalNameFactory.getKey(animalName);
    return !usedNames.has(key);
  }
}
