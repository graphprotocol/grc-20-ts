import { expect, it } from 'vitest';

import { generate, isValid } from './id-utils.js';

it('should validate uuid', () => {
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid('3af3e22d-2169-4a07-8681-516710b7ecf1')).toBe(true);
  expect(isValid('3af3e22d21694a078681516710b7ecf1')).toBe(true);
});

it('should not validate invalid id', () => {
  expect(isValid('invalid-id')).toBe(false);
  expect(isValid('0123456789012345678901')).toBe(false);
});
