import { describe, expect, it } from 'vitest';
import type { GraphUri } from '../types.js';
import { fromEntityId, toEntityId, toSpaceId } from './scheme.js';

describe('fromEntityId', () => {
  it('should return a valid graph uri', () => {
    const uri = fromEntityId('test-entity-id');
    expect(uri).toBe('graph://test-entity-id');
  });

  it('should return a valid graph uri with space id', () => {
    const uri = fromEntityId('test-entity-id', { spaceId: 'test-space-id' });
    expect(uri).toBe('graph://test-entity-id?s=test-space-id');
  });

  it('should throw error if entity id starts with graph://', () => {
    expect(() => fromEntityId('graph://test-entity-id')).toThrowError();
  });
});

describe('toEntityId', () => {
  it('should return the entity id', () => {
    const entityId = toEntityId('graph://test-entity-id');
    expect(entityId).toBe('test-entity-id');
  });

  it('should throw error if entity id is not valid', () => {
    expect(() => toEntityId('invalid id' as GraphUri)).toThrowError();
  });
});

describe('toSpaceId', () => {
  it('should return the space id', () => {
    const spaceId = toSpaceId('graph://test-entity-id?s=test-space-id');
    expect(spaceId).toBe('test-space-id');
  });

  it('should return null if space id is not present', () => {
    expect(toSpaceId('graph://test-entity-id')).toBe(null);
  });
});
