import { expect, it } from 'vitest';

import { BASE58_ALLOWED_CHARS } from './core/base58.js';
import { generate, isValid } from './id.js';

// @NOTE this would be a good candidate for DST-style tests
it('should generate valid base58 encoded id with length of 22', () => {
  const id = generate();
  expect(id).toBeTypeOf('string');
  expect(id.length).toBe(22);
  expect(id.split('').every(char => BASE58_ALLOWED_CHARS.includes(char))).toBe(true);
});

it('should validate base58 encoded id', () => {
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid('M5uDP7nCw3nvfQPUryn9gx')).toBe(true);
  // length is 21
  expect(isValid('D6Wy4bdtdoUrG3PDZceHr')).toBe(true);
});

it('should not validate invalid id', () => {
  expect(isValid('invalid-id')).toBe(false);
  expect(isValid('0123456789012345678901')).toBe(false);
});
