import { expect, it } from 'vitest';
import { make } from './account.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { ops } = make(ZERO_ADDRESS);
  const [entityOp, accountTypeOp, networkOp] = ops;

  // Check createEntity op for the account
  expect(entityOp?.type).toBe('createEntity');

  // Check types relation to ACCOUNT_TYPE
  expect(accountTypeOp?.type).toBe('createRelation');

  // Check network relation to ETHEREUM
  expect(networkOp?.type).toBe('createRelation');

  // Verify we have the expected number of ops
  expect(ops.length).toBe(3);
});
