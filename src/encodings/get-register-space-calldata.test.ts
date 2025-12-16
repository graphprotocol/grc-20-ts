import { describe, expect, it } from 'vitest';

import { getRegisterSpaceCalldata } from './get-register-space-calldata.js';

describe('getRegisterSpaceCalldata', () => {
  it('should generate valid calldata', () => {
    const calldata = getRegisterSpaceCalldata();
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should return consistent calldata', () => {
    const calldata1 = getRegisterSpaceCalldata();
    const calldata2 = getRegisterSpaceCalldata();
    expect(calldata1).toBe(calldata2);
  });
});
