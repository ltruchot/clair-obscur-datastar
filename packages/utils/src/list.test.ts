import { describe, expect, it } from 'vitest';
import { dedupeList } from './list.ts';

describe('deduplicate', () => {
  it('should let an empty list as is', () => {
    expect(dedupeList([])).toEqual([]);
  });

  it('should deduplicate a list with duplicates', () => {
    expect(dedupeList([1, 2, 2, 3, 4, 4, 5, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should deduplicate a string list', () => {
    expect(dedupeList(['a', 'b', 'c', 'c', 'a', 'd', 'd', 'e', 'e'])).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
