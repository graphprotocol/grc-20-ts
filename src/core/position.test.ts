import { describe, expect, it } from 'vitest';
import { generate, sort } from './position.js'; // Adjust import path as needed

describe('fractional index default generation', () => {
  it('should generate a random position', () => {
    const a = generate();
    const b = generate();
    expect(a).not.toEqual(b);
  });
});

describe('fractional index sorting', () => {
  describe('sort function', () => {
    it('should handle empty array', () => {
      const result = sort([]);
      expect(result).toEqual([]);
    });

    it('should handle array with only nulls', () => {
      const positions = [null, null, null];
      const result = sort(positions);
      expect(result).toEqual([null, null, null]);
    });

    it('should handle array with only strings', () => {
      const positions = ['c', 'a', 'b'];
      const result = sort(positions);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should put null values at the bottom when mixed with strings', () => {
      const positions = ['b', null, 'a', null, 'c'];
      const result = sort(positions);
      expect(result).toEqual(['a', 'b', 'c', null, null]);
    });

    it('should sort fractional indexes correctly', () => {
      const positions = ['a1', 'a0', 'a2'];
      const result = sort(positions);
      expect(result).toEqual(['a0', 'a1', 'a2']);
    });

    it('should handle complex fractional indexes', () => {
      const positions = ['a0V', 'a0', 'a0G', 'a1'];
      const result = sort(positions);
      expect(result).toEqual(['a0', 'a0G', 'a0V', 'a1']);
    });

    it('should maintain stable sort for identical values', () => {
      const positions = ['a0', 'a0', 'a1'];
      const result = sort(positions);
      expect(result).toEqual(['a0', 'a0', 'a1']);
    });

    it('should handle single null value', () => {
      const positions = [null];
      const result = sort(positions);
      expect(result).toEqual([null]);
    });

    it('should handle single string value', () => {
      const positions = ['a0'];
      const result = sort(positions);
      expect(result).toEqual(['a0']);
    });

    it('should sort with nulls at bottom regardless of position in input', () => {
      const positions1 = [null, 'a', 'b'];
      const positions2 = ['a', null, 'b'];
      const positions3 = ['a', 'b', null];

      const expected = ['a', 'b', null];

      expect(sort(positions1)).toEqual(expected);
      expect(sort(positions2)).toEqual(expected);
      expect(sort(positions3)).toEqual(expected);
    });

    it('should handle very long fractional indexes', () => {
      const positions = [`a0${'x'.repeat(50)}`, 'a0', `a0${'y'.repeat(30)}`];
      const result = sort(positions);
      expect(result).toEqual(['a0', `a0${'x'.repeat(50)}`, `a0${'y'.repeat(30)}`]);
    });

    it('should handle mixed case and special characters', () => {
      const positions = ['Z', 'a', 'A', 'z'];
      const result = sort(positions);
      // JavaScript's localeCompare should handle this correctly
      expect(result).toEqual(['a', 'A', 'z', 'Z']);
    });

    it('should handle large arrays efficiently', () => {
      const positions: (string | null)[] = [];

      // Create a large array with mixed values
      for (let i = 100; i >= 0; i--) {
        positions.push(`a${i}`);
        if (i % 10 === 0) positions.push(null);
      }

      const result = sort(positions);

      // Check that all string values are sorted before nulls
      const stringValues = result.filter(p => p !== null) as string[];
      const nullValues = result.filter(p => p === null);

      // String values should be sorted
      for (let i = 1; i < stringValues.length; i++) {
        const left = stringValues[i - 1];
        const right = stringValues[i];

        if (left && right) {
          expect(left.localeCompare(right)).toBeLessThanOrEqual(0);
        }
      }

      // All nulls should be at the end
      const firstNullIndex = result.indexOf(null);
      if (firstNullIndex !== -1) {
        expect(result.slice(firstNullIndex)).toEqual(nullValues);
      }
    });

    it('should handle edge case fractional indexes that might cause sorting issues', () => {
      const positions = [
        'z'.repeat(10), // Very "high" value
        'a0',
        null,
        '', // Empty string
        'a',
      ];

      const result = sort(positions);

      // Empty string should come first, then sorted strings, then nulls
      expect(result[0]).toBe('');
      expect(result[result.length - 1]).toBe(null);

      // Check that non-null, non-empty strings are sorted
      const nonEmptyStrings = result.filter(p => p !== null && p !== '') as string[];
      for (let i = 1; i < nonEmptyStrings.length; i++) {
        const left = nonEmptyStrings[i - 1];
        const right = nonEmptyStrings[i];

        if (left && right) {
          expect(left.localeCompare(right)).toBeLessThanOrEqual(0);
        }
      }
    });
  });
});
