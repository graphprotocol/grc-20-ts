import { expect, it } from 'vitest';

import { BASE58_ALLOWED_CHARS } from './core/base58.js';
import { make } from './id.js';

// @NOTE this would be a good candidate for DST-style tests
it('should generate valid base58 encoded id with length of 22', () => {
  const id = make();
  expect(id).toBeTypeOf('string');
  expect(id.length).toBe(22);
  expect(id.split('').every(char => BASE58_ALLOWED_CHARS.includes(char))).toBe(true);
});
