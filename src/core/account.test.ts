import { expect, it } from 'vitest';
import { Id } from '../id.js';
import { NetworkIds, SystemIds } from '../system-ids.js';
import { make } from './account.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { accountId, ops } = make(ZERO_ADDRESS);
  const [entityOp, accountTypeOp, networkOp] = ops;

  expect(entityOp?.type).toBe('UPDATE_ENTITY');
  if (entityOp?.type === 'UPDATE_ENTITY' && entityOp?.entity.values?.[0]) {
    expect(entityOp.entity.values[0].property).toBe(SystemIds.ADDRESS_PROPERTY);
    expect(entityOp.entity.values[0]).toMatchObject({ type: 'text', value: ZERO_ADDRESS });
    expect(entityOp.entity.id).toBe(Id(accountId));
  }

  if (entityOp?.type === 'UPDATE_ENTITY' && entityOp?.entity.values?.[1]) {
    expect(entityOp.entity.values[1].property).toBe(SystemIds.NAME_PROPERTY);
    expect(entityOp.entity.values[1]).toMatchObject({ type: 'text', value: ZERO_ADDRESS });
    expect(entityOp.entity.id).toBe(Id(accountId));
  }

  expect(accountTypeOp?.type).toBe('CREATE_RELATION');
  if (accountTypeOp?.type === 'CREATE_RELATION') {
    expect(accountTypeOp.relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(accountTypeOp.relation.toEntity).toBe(SystemIds.ACCOUNT_TYPE);
    expect(accountTypeOp.relation.fromEntity).toBe(Id(accountId));
  }

  expect(networkOp?.type).toBe('CREATE_RELATION');
  if (networkOp?.type === 'CREATE_RELATION') {
    expect(networkOp.relation.type).toBe(SystemIds.NETWORK_PROPERTY);
    expect(networkOp.relation.toEntity).toBe(NetworkIds.ETHEREUM);
    expect(networkOp.relation.fromEntity).toBe(Id(accountId));
  }
});
