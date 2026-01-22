import { type Hex, keccak256, toHex } from 'viem';

/**
 * Empty space ID - represents an unregistered space (bytes16 zero)
 */
export const EMPTY_SPACE_ID = '0x00000000000000000000000000000000' as Hex;

/**
 * Zero address - represents an invalid or unset address
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Hex;

/**
 * Empty topic for enter() calls (bytes32 zero)
 */
export const EMPTY_TOPIC = '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;

/**
 * Action hash for GOVERNANCE.EDITS_PUBLISHED
 * Used when publishing edits via SpaceRegistry.enter()
 */
export const EDITS_PUBLISHED_ACTION = keccak256(toHex('GOVERNANCE.EDITS_PUBLISHED'));

/**
 * Space type identifier for EOA (personal) spaces
 */
export const EOA_SPACE_TYPE = keccak256(toHex('EOA_SPACE'));

/**
 * Default version string for space registration
 */
export const DEFAULT_SPACE_VERSION = '1.0.0';
