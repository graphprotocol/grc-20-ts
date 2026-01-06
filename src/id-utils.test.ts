import { expect, it } from 'vitest';
import { Id } from './id.js';
import { fromBase64, fromBytes, generate, IdBase64, toBase64, toBytes } from './id-utils.js';

it('should generate valid uuid', () => {
  const id = generate();
  expect(id).toBeTypeOf('string');
  expect(id.length).toBe(32);
  expect(id).toMatch(/^[0-9a-fA-F]{32}$/);
});

it('should convert id to base64', () => {
  const id = Id('3af3e22d-2169-4a07-8681-516710b7ecf1');
  const base64 = toBase64(id);
  expect(base64).toBeTypeOf('string');
  expect(base64).toBe('OvPiLSFpSgeGgVFnELfs8Q==');
  expect(toBase64(Id('1d501a3a-d6ce-4693-bc90-d25286f21c7e'))).toBe('HVAaOtbORpO8kNJShvIcfg==');
});

it('should accept dashless UUID for toBytes and return dashless UUID from fromBytes', () => {
  const dashed = '3af3e22d-2169-4a07-8681-516710b7ecf1';
  const dashless = '3af3e22d21694a078681516710b7ecf1';

  expect(fromBytes(toBytes(dashed))).toBe(dashless);
  expect(fromBytes(toBytes(dashless))).toBe(dashless);
});

it('should decode base64 to dashless UUID and keep base64 stable for dashless UUID input', () => {
  // Same UUID, two input formats.
  const dashed = Id('3af3e22d-2169-4a07-8681-516710b7ecf1');
  const dashless = Id('3af3e22d21694a078681516710b7ecf1');

  // toBase64 should not depend on whether the UUID contains dashes.
  expect(toBase64(dashed)).toBe('OvPiLSFpSgeGgVFnELfs8Q==');
  expect(toBase64(dashless)).toBe('OvPiLSFpSgeGgVFnELfs8Q==');

  // fromBase64 should decode to an Id (canonical form is dashless).
  expect(fromBase64(IdBase64('OvPiLSFpSgeGgVFnELfs8Q=='))).toBe('3af3e22d21694a078681516710b7ecf1');
});
