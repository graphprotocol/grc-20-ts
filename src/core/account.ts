/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */

import type { Op } from '@geoprotocol/grc-20';
import { createEntity } from '../graph/create-entity.js';
import { createRelation } from '../graph/create-relation.js';
import { generate } from '../id-utils.js';
import { getChecksumAddress } from './get-checksum-address.js';
import { ETHEREUM } from './ids/network.js';
import { ACCOUNT_TYPE, ADDRESS_PROPERTY, NAME_PROPERTY, NETWORK_PROPERTY, TYPES_PROPERTY } from './ids/system.js';

type MakeAccountReturnType = {
  accountId: string;
  ops: Op[];
};

/**
 * Returns the ops to create an entity representing an Account.
 *
 * @example
 * ```ts
 * const { accountId, ops } = Account.make('0x1234');
 * console.log(accountId); // 'gw9uTVTnJdhtczyuzBkL3X'
 * console.log(ops); // [...]
 * ```
 *
 * @param address – Ethereum address
 * @returns accountId – base58 encoded v4 uuid representing the account entity: {@link MakeAccountReturnType}
 * @returns ops – The ops for the Account entity: {@link MakeAccountReturnType}
 */
export function make(address: string): MakeAccountReturnType {
  const accountId = generate();
  const checkedAddress: string = getChecksumAddress(address);

  const ops: Op[] = [];

  const { ops: entityOps } = createEntity({
    id: accountId,
    values: [
      {
        property: ADDRESS_PROPERTY,
        type: 'text',
        value: checkedAddress,
      },
      {
        property: NAME_PROPERTY,
        type: 'text',
        value: checkedAddress,
      },
    ],
  });
  ops.push(...entityOps);

  // Types -> Account
  const { ops: accountOps } = createRelation({
    fromEntity: accountId,
    type: TYPES_PROPERTY,
    toEntity: ACCOUNT_TYPE,
  });
  ops.push(...accountOps);

  // Network -> Ethereum
  // Signals that the account is for the Ethereum family of chains
  const { ops: networkOps } = createRelation({
    fromEntity: accountId,
    type: NETWORK_PROPERTY,
    toEntity: ETHEREUM,
  });
  ops.push(...networkOps);

  return {
    accountId,
    ops,
  };
}
