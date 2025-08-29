import { encodeAbiParameters } from 'viem';
import { isValid } from '../id.js';

export class InvalidEntityIdError extends Error {
  constructor(entityId: string) {
    super(`Invalid entity ID: ${entityId}`);
    this.name = 'InvalidEntityIdError';
  }
}

export class InvalidSpaceIdError extends Error {
  constructor(spaceId: string) {
    super(`Invalid space ID: ${spaceId}`);
    this.name = 'InvalidSpaceIdError';
  }
}

export class InvalidVoteTypeError extends Error {
  constructor(voteType: string) {
    super(`Invalid vote type: ${voteType}. Must be 'up', 'down', or 'remove'`);
    this.name = 'InvalidVoteTypeError';
  }
}

const ACTION_FUNCTION_ABI = [
  {
    internalType: 'uint16',
    name: 'kind',
    type: 'uint16',
  },
  {
    internalType: 'uint16',
    name: 'version',
    type: 'uint16',
  },
  {
    internalType: 'uint8',
    name: 'objectType',
    type: 'uint8',
  },
  {
    internalType: 'bytes16',
    name: 'spacePOV',
    type: 'bytes16',
  },
  {
    internalType: 'bytes16',
    name: 'groupId',
    type: 'bytes16',
  },
  {
    internalType: 'bytes16',
    name: 'objectId',
    type: 'bytes16',
  },
  {
    internalType: 'bytes',
    name: 'payload',
    type: 'bytes',
  },
];

type UpvoteEntityParams = {
  entityId: string;
  spaceId: string;
  voteType: 'up' | 'down' | 'remove';
};

/**
 * The spec for the payload in the Actions contract is as follows:
 * Upvote      – 0x00
 * Downvote    – 0x01
 * Remove vote – 0x02
 *
 * https://github.com/defi-wonderland/gaia/blob/7e5b5aaedee43c3f4967616b738e68265bfe1450/actions-indexer/README.md#example
 */
const PACKED_VOTE_TYPE: Record<UpvoteEntityParams['voteType'], `0x${string}`> = {
  up: '0x00',
  down: '0x01',
  remove: '0x02',
};

/**
 * Encodes voting action parameters for the Actions contract
 * @param params - The voting parameters
 * @param params.entityId - UUID of the entity to vote on
 * @param params.spaceId - UUID of the space containing the entity
 * @param params.voteType - Type of vote: 'up' (upvote), 'down' (downvote), or 'remove' (remove vote)
 * @returns Encoded ABI parameters as hex string for contract call
 * @throws {Error} If entityId or spaceId are invalid UUIDs
 * @throws {Error} If voteType is not one of the allowed values
 */
export function voteOnEntity({ entityId, spaceId, voteType }: UpvoteEntityParams): `0x${string}` {
  if (!isValid(entityId)) {
    throw new InvalidEntityIdError(entityId);
  }

  if (!isValid(spaceId)) {
    throw new InvalidSpaceIdError(spaceId);
  }

  if (!PACKED_VOTE_TYPE[voteType]) {
    throw new InvalidVoteTypeError(voteType);
  }

  /**
   * Encode parameters for the Actions contract
   * https://github.com/defi-wonderland/gaia/blob/7e5b5aaedee43c3f4967616b738e68265bfe1450/actions-indexer/README.md#example
   *
   * Parameters:
   * - kind (0): Type of action being performed (0 = voting)
   * - version (1): Version identifier for the action schema
   * - objectType (0): Target object type (0 = Entity, 1 = Relation)
   * - spacePOV: Unique identifier for the space context (16 bytes)
   * - groupId (0): Group identifier for organizing actions
   * - objectId: Unique identifier for the target entity (16 bytes)
   * - payload: Vote type (0x00 = upvote, 0x01 = downvote, 0x02 = remove vote)
   */
  return encodeAbiParameters(ACTION_FUNCTION_ABI, [
    0,
    1,
    0,
    uuidToHex(spaceId),
    '0x00000000000000000000000000000000',
    uuidToHex(entityId),
    PACKED_VOTE_TYPE[voteType],
  ]);
}

/**
 * Converts a UUID string to a bytes16 hex representation required by the Actions contract
 * The contract expects 16-byte identifiers for spacePOV and objectId fields
 * @param uuid - UUID string in standard format (e.g., "550e8400-e29b-41d4-a716-446655440000")
 * @returns Hex string with 0x prefix representing 16 bytes (e.g., "0x550e8400e29b41d4a716446655440000")
 */
function uuidToHex(uuid: string): `0x${string}` {
  const hex = uuid.replace(/-/g, '');
  return `0x${hex}`;
}
