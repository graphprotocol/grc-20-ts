import { expect, it } from 'vitest';

import { Id, generate, isValid, toBase64 } from './idv2.js';

it('should generate valid uuid', () => {
  const id = generate();
  expect(id).toBeTypeOf('string');
  expect(id.length).toBe(36);
  expect(id).toMatch(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
});

it('should validate uuid', () => {
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid(generate())).toBe(true);
  expect(isValid('3af3e22d-2169-4a07-8681-516710b7ecf1')).toBe(true);
});

it('should not validate invalid id', () => {
  expect(isValid('invalid-id')).toBe(false);
  expect(isValid('0123456789012345678901')).toBe(false);
});

it('should convert id to base64', () => {
  const id = Id('3af3e22d-2169-4a07-8681-516710b7ecf1');
  const base64 = toBase64(id);
  expect(base64).toBeTypeOf('string');
  expect(base64).toBe('OvPiLSFpSgeGgVFnELfs8Q==');
  expect(toBase64(Id('1d501a3a-d6ce-4693-bc90-d25286f21c7e'))).toBe('HVAaOtbORpO8kNJShvIcfg==');
});
