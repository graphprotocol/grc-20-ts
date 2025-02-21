import { expect, it } from 'vitest';
import { NetworkIds, SystemIds } from '../system-ids.js';
import { make } from './account.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { accountId, ops } = make(ZERO_ADDRESS);
  const [accountTypeOp, networkOp, addressOp, nameOp] = ops;

  expect(accountTypeOp.type).toBe('CREATE_RELATION');
  expect(accountTypeOp.relation.type).toBe(SystemIds.TYPES_PROPERTY);
  expect(accountTypeOp.relation.toEntity).toBe(SystemIds.ACCOUNT_TYPE);
  expect(accountTypeOp.relation.fromEntity).toBe(accountId);

  expect(networkOp.type).toBe('CREATE_RELATION');
  expect(networkOp.relation.type).toBe(SystemIds.NETWORK_PROPERTY);
  expect(networkOp.relation.toEntity).toBe(NetworkIds.ETHEREUM);
  expect(networkOp.relation.fromEntity).toBe(accountId);

  expect(addressOp.type).toBe('SET_TRIPLE');
  expect(addressOp.triple.attribute).toBe(SystemIds.ADDRESS_PROPERTY);
  expect(addressOp.triple.value.type).toBe('TEXT');
  expect(addressOp.triple.value.value).toBe(ZERO_ADDRESS);

  expect(nameOp.type).toBe('SET_TRIPLE');
  expect(nameOp.triple.attribute).toBe(SystemIds.NAME_PROPERTY);
  expect(nameOp.triple.value.type).toBe('TEXT');
  expect(nameOp.triple.value.value).toBe(ZERO_ADDRESS);
});
