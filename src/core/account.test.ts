import { expect, it } from 'vitest';
import { make } from './account.js';
import { NETWORK_IDS, SYSTEM_IDS } from '../system-ids.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { accountId, ops } = make(ZERO_ADDRESS);
  const [accountTypeOp, networkOp, addressOp, nameOp] = ops;

  expect(accountTypeOp.type).toBe('CREATE_RELATION');
  expect(accountTypeOp.relation.type).toBe(SYSTEM_IDS.TYPES_ATTRIBUTE);
  expect(accountTypeOp.relation.toEntity).toBe(SYSTEM_IDS.ACCOUNT_TYPE);
  expect(accountTypeOp.relation.fromEntity).toBe(accountId);

  expect(networkOp.type).toBe('CREATE_RELATION');
  expect(networkOp.relation.type).toBe(SYSTEM_IDS.NETWORK_ATTRIBUTE);
  expect(networkOp.relation.toEntity).toBe(NETWORK_IDS.ETHEREUM);
  expect(networkOp.relation.fromEntity).toBe(accountId);

  expect(addressOp.type).toBe('SET_TRIPLE');
  expect(addressOp.triple.attribute).toBe(SYSTEM_IDS.ADDRESS_ATTRIBUTE);
  expect(addressOp.triple.value.type).toBe('TEXT');
  expect(addressOp.triple.value.value).toBe(ZERO_ADDRESS);

  expect(nameOp.type).toBe('SET_TRIPLE');
  expect(nameOp.triple.attribute).toBe(SYSTEM_IDS.NAME_ATTRIBUTE);
  expect(nameOp.triple.value.type).toBe('TEXT');
  expect(nameOp.triple.value.value).toBe(ZERO_ADDRESS);
});
