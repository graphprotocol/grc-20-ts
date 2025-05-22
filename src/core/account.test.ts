import { expect, it } from 'vitest';
import { Id, toBase64 } from '../id.js';
import { NetworkIds, SystemIds } from '../system-ids.js';
import { make } from './account.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { accountId, ops } = make(ZERO_ADDRESS);
  const [entityOp, accountTypeOp, networkOp] = ops;

  expect(entityOp?.type).toBe('UPDATE_ENTITY');
  if (entityOp?.type === 'UPDATE_ENTITY' && entityOp?.entity.values?.[0]) {
    expect(entityOp.entity.values[0].propertyId).toBe(toBase64(SystemIds.ADDRESS_PROPERTY));
    expect(entityOp.entity.values[0].value).toBe(ZERO_ADDRESS);
    expect(entityOp.entity.id).toBe(toBase64(Id(accountId)));
  }

  if (entityOp?.type === 'UPDATE_ENTITY' && entityOp?.entity.values?.[1]) {
    expect(entityOp.entity.values[1].propertyId).toBe(toBase64(SystemIds.NAME_PROPERTY));
    expect(entityOp.entity.values[1].value).toBe(ZERO_ADDRESS);
    expect(entityOp.entity.id).toBe(toBase64(Id(accountId)));
  }

  expect(accountTypeOp?.type).toBe('CREATE_RELATION');
  if (accountTypeOp?.type === 'CREATE_RELATION') {
    expect(accountTypeOp.relation.type).toBe(toBase64(SystemIds.TYPES_PROPERTY));
    expect(accountTypeOp.relation.toEntity).toBe(toBase64(SystemIds.ACCOUNT_TYPE));
    expect(accountTypeOp.relation.fromEntity).toBe(toBase64(Id(accountId)));
  }

  expect(networkOp?.type).toBe('CREATE_RELATION');
  if (networkOp?.type === 'CREATE_RELATION') {
    expect(networkOp.relation.type).toBe(toBase64(SystemIds.NETWORK_PROPERTY));
    expect(networkOp.relation.toEntity).toBe(toBase64(NetworkIds.ETHEREUM));
    expect(networkOp.relation.fromEntity).toBe(toBase64(Id(accountId)));
  }
});
