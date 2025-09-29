import type { AnimalName } from '../entities/animal-name';
import { ADJECTIVES, AnimalNameFactory, ANIMALS } from '../entities/animal-name';

export interface AnimalNameGenerator {
  generateUnique(usedNames: Set<string>): AnimalName;
  isAvailable(animalName: AnimalName, usedNames: Set<string>): boolean;
}

export class DefaultAnimalNameGenerator implements AnimalNameGenerator {
  private readonly maxAttempts = 1000;

  generateUnique(usedNames: Set<string>): AnimalName {
    const totalCombinations = ADJECTIVES.length * ANIMALS.length;

    if (usedNames.size >= totalCombinations) {
      throw new Error('All animal name combinations are exhausted');
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

    throw new Error('Unable to generate unique animal name after exhaustive search');
  }

  isAvailable(animalName: AnimalName, usedNames: Set<string>): boolean {
    const key = AnimalNameFactory.getKey(animalName);
    return !usedNames.has(key);
  }
}
