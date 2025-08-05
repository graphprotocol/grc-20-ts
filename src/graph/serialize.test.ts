import { describe, expect, it } from 'vitest';
import { serializeBoolean, serializeDate, serializeNumber, serializePoint } from './serialize.js';

describe('serializeNumber', () => {
  it('should convert positive numbers to string', () => {
    expect(serializeNumber(42)).toBe('42');
    expect(serializeNumber(0)).toBe('0');
    expect(serializeNumber(123.456)).toBe('123.456');
  });

  it('should convert negative numbers to string', () => {
    expect(serializeNumber(-42)).toBe('-42');
    expect(serializeNumber(-123.456)).toBe('-123.456');
  });
});

describe('serializeBoolean', () => {
  it('should convert true to "1"', () => {
    expect(serializeBoolean(true)).toBe('1');
  });

  it('should convert false to "0"', () => {
    expect(serializeBoolean(false)).toBe('0');
  });
});

describe('serializeDate', () => {
  it('should convert Date to ISO string', () => {
    const date = new Date('2024-03-20T12:00:00Z');
    expect(serializeDate(date)).toBe('2024-03-20T12:00:00.000Z');
  });

  it('should handle different dates correctly', () => {
    const date1 = new Date('2024-01-01T00:00:00Z');
    const date2 = new Date('2024-12-31T23:59:59Z');

    expect(serializeDate(date1)).toBe('2024-01-01T00:00:00.000Z');
    expect(serializeDate(date2)).toBe('2024-12-31T23:59:59.000Z');
  });
});

describe('serializePoint', () => {
  it('should join array of numbers with commas', () => {
    expect(serializePoint([1, 2, 3])).toBe('1,2,3');
    expect(serializePoint([0, 0])).toBe('0,0');
  });

  it('should handle decimal numbers', () => {
    expect(serializePoint([1.5, 2.7, 3.1])).toBe('1.5,2.7,3.1');
  });

  it('should handle negative numbers', () => {
    expect(serializePoint([-1, -2, 3])).toBe('-1,-2,3');
  });

  it('should handle single number array', () => {
    expect(serializePoint([42])).toBe('42');
  });
});
