export interface AnimalNameRegistryPort {
  getUsedAnimalNames(): Set<string>;
  addUsedAnimalName(key: string): void;
  removeUsedAnimalName(key: string): void;
}
