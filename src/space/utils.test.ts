import { describe, expect, it } from 'vitest';

import { hexToFormattedUuid, hexToUuid, parseSpaceId } from './utils.js';

describe('parseSpaceId', () => {
  const validHex = '0x550e8400e29b41d4a716446655440000';
  const validUuidNoDashes = '550e8400e29b41d4a716446655440000';
  const validUuidWithDashes = '550e8400-e29b-41d4-a716-446655440000';

  it('should parse hex format with 0x prefix', () => {
    const result = parseSpaceId(validHex);
    expect(result).toBe('0x550e8400e29b41d4a716446655440000');
  });

  it('should parse UUID format without dashes', () => {
    const result = parseSpaceId(validUuidNoDashes);
    expect(result).toBe('0x550e8400e29b41d4a716446655440000');
  });

  it('should parse UUID format with dashes', () => {
    const result = parseSpaceId(validUuidWithDashes);
    expect(result).toBe('0x550e8400e29b41d4a716446655440000');
  });

  it('should normalize to lowercase', () => {
    const result = parseSpaceId('0x550E8400E29B41D4A716446655440000');
    expect(result).toBe('0x550e8400e29b41d4a716446655440000');
  });

  it('should throw for invalid length (too short)', () => {
    expect(() => parseSpaceId('0x550e8400')).toThrow('Invalid space ID length');
  });

  it('should throw for invalid length (too long)', () => {
    expect(() => parseSpaceId('0x550e8400e29b41d4a716446655440000aaaa')).toThrow('Invalid space ID length');
  });

  it('should throw for non-hex characters', () => {
    expect(() => parseSpaceId('0xZZZe8400e29b41d4a716446655440000')).toThrow('non-hex characters');
  });

  it('should handle empty space ID (all zeros)', () => {
    const result = parseSpaceId('0x00000000000000000000000000000000');
    expect(result).toBe('0x00000000000000000000000000000000');
  });
});

describe('hexToUuid', () => {
  it('should convert hex to UUID without dashes', () => {
    const result = hexToUuid('0x550e8400e29b41d4a716446655440000');
    expect(result).toBe('550e8400e29b41d4a716446655440000');
  });

  it('should handle longer hex strings (truncate to 32 chars)', () => {
    // bytes16 is 32 hex chars, anything after is ignored
    const result = hexToUuid('0x550e8400e29b41d4a716446655440000ffffffff');
    expect(result).toBe('550e8400e29b41d4a716446655440000');
  });

  it('should normalize to lowercase', () => {
    const result = hexToUuid('0x550E8400E29B41D4A716446655440000');
    expect(result).toBe('550e8400e29b41d4a716446655440000');
  });
});

describe('hexToFormattedUuid', () => {
  it('should convert hex to UUID with dashes', () => {
    const result = hexToFormattedUuid('0x550e8400e29b41d4a716446655440000');
    expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should produce standard UUID format (8-4-4-4-12)', () => {
    const result = hexToFormattedUuid('0x550e8400e29b41d4a716446655440000');
    const parts = result.split('-');
    expect(parts).toHaveLength(5);
    expect(parts[0]).toHaveLength(8);
    expect(parts[1]).toHaveLength(4);
    expect(parts[2]).toHaveLength(4);
    expect(parts[3]).toHaveLength(4);
    expect(parts[4]).toHaveLength(12);
  });
});

describe('round-trip conversion', () => {
  it('should round-trip from hex to uuid and back', () => {
    const original = '0x550e8400e29b41d4a716446655440000';
    const uuid = hexToUuid(original);
    const backToHex = parseSpaceId(uuid);
    expect(backToHex).toBe(original);
  });

  it('should round-trip from formatted uuid', () => {
    const original = '0x550e8400e29b41d4a716446655440000';
    const formattedUuid = hexToFormattedUuid(original);
    const backToHex = parseSpaceId(formattedUuid);
    expect(backToHex).toBe(original);
  });
});
