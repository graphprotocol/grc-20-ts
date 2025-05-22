import { v4 } from 'uuid';
import { describe, expect, it } from 'vitest';

import { decodeBase58ToUUID, encodeBase58 } from './base58.js';

describe('base58', () => {
  it('should be able to encoded a UUID to base58 and then decode it back to its original UUID', () => {
    const expected = v4();
    const given = expected.replaceAll(/-/g, '');

    const encoded = encodeBase58(given);

    // We check the length should be 22 in the ID.generate() function and
    // re-run encodeBase58 if not.
    expect(encoded.length === 22 || encoded.length === 21).toBe(true);

    const decoded = decodeBase58ToUUID(encoded);
    expect(decoded).toHaveLength(expected.length);
    expect(decoded).toEqual(expected);
  });
});
