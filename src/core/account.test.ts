import type { CreateEntity, CreateRelation } from '@geoprotocol/grc-20';
import { expect, it } from 'vitest';
import { toGrcId } from '../id-utils.js';
import { make } from './account.js';
import { ETHEREUM } from './ids/network.js';
import { ACCOUNT_TYPE, ADDRESS_PROPERTY, NAME_PROPERTY, NETWORK_PROPERTY, TYPES_PROPERTY } from './ids/system.js';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

it('should generate ops for an account entity', () => {
  const { accountId, ops } = make(ZERO_ADDRESS);
  const [entityOp, accountTypeOp, networkOp] = ops;

  // Verify we have the expected number of ops
  expect(ops.length).toBe(3);

  // Check createEntity op for the account
  expect(entityOp?.type).toBe('createEntity');
  const createEntityOp = entityOp as CreateEntity;
  expect(createEntityOp.id).toEqual(toGrcId(accountId));

  // Verify ADDRESS_PROPERTY value
  const addressValue = createEntityOp.values.find(v => {
    const propBytes = v.property;
    return propBytes.every((b, i) => b === toGrcId(ADDRESS_PROPERTY)[i]);
  });
  expect(addressValue).toBeDefined();
  expect(addressValue?.value.type).toBe('text');
  if (addressValue?.value.type === 'text') {
    expect(addressValue.value.value).toBe(ZERO_ADDRESS);
  }

  // Verify NAME_PROPERTY value
  const nameValue = createEntityOp.values.find(v => {
    const propBytes = v.property;
    return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
  });
  expect(nameValue).toBeDefined();
  expect(nameValue?.value.type).toBe('text');
  if (nameValue?.value.type === 'text') {
    expect(nameValue.value.value).toBe(ZERO_ADDRESS);
  }

  // Check types relation to ACCOUNT_TYPE
  expect(accountTypeOp?.type).toBe('createRelation');
  const accountTypeRelOp = accountTypeOp as CreateRelation;
  expect(accountTypeRelOp.from).toEqual(toGrcId(accountId));
  expect(accountTypeRelOp.to).toEqual(toGrcId(ACCOUNT_TYPE));
  expect(accountTypeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

  // Check network relation to ETHEREUM
  expect(networkOp?.type).toBe('createRelation');
  const networkRelOp = networkOp as CreateRelation;
  expect(networkRelOp.from).toEqual(toGrcId(accountId));
  expect(networkRelOp.to).toEqual(toGrcId(ETHEREUM));
  expect(networkRelOp.relationType).toEqual(toGrcId(NETWORK_PROPERTY));
});

it('should use checksum address format', () => {
  // Lowercase address should be converted to checksum format
  const lowercaseAddress = '0xabcd1234567890abcdef1234567890abcdef1234';
  const { ops } = make(lowercaseAddress);

  const entityOp = ops[0] as CreateEntity;
  const addressValue = entityOp.values.find(v => {
    const propBytes = v.property;
    return propBytes.every((b, i) => b === toGrcId(ADDRESS_PROPERTY)[i]);
  });

  expect(addressValue).toBeDefined();
  expect(addressValue?.value.type).toBe('text');
  if (addressValue?.value.type === 'text') {
    // Should be checksum formatted (mixed case)
    expect(addressValue.value.value).not.toBe(lowercaseAddress);
    expect(addressValue.value.value.toLowerCase()).toBe(lowercaseAddress.toLowerCase());
  }
});

it('should generate unique account IDs for different calls', () => {
  const { accountId: id1 } = make(ZERO_ADDRESS);
  const { accountId: id2 } = make(ZERO_ADDRESS);

  expect(id1).not.toBe(id2);
});

it('should generate correct number of ops for account creation', () => {
  const { ops } = make(ZERO_ADDRESS);

  // 1 createEntity + 1 createRelation (type) + 1 createRelation (network)
  expect(ops.length).toBe(3);

  // Verify op types in correct order
  expect(ops[0]?.type).toBe('createEntity');
  expect(ops[1]?.type).toBe('createRelation');
  expect(ops[2]?.type).toBe('createRelation');
});
