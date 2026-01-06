import { describe, expect, it } from 'vitest';

import { getCreatePersonalSpaceCalldata } from './get-create-personal-space-calldata.js';

describe('getCreatePersonalSpaceCalldata', () => {
  it('should generate valid calldata', () => {
    const calldata = getCreatePersonalSpaceCalldata();
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should return consistent calldata', () => {
    const calldata1 = getCreatePersonalSpaceCalldata();
    const calldata2 = getCreatePersonalSpaceCalldata();
    expect(calldata1).toBe(calldata2);
  });
});
