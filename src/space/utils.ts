import type { Hex } from 'viem';

/**
 * Parses a space ID from various formats to bytes16 hex.
 *
 * Accepts:
 * - UUID with dashes: "550e8400-e29b-41d4-a716-446655440000"
 * - UUID without dashes: "550e8400e29b41d4a716446655440000"
 * - Hex with 0x prefix: "0x550e8400e29b41d4a716446655440000"
 *
 * @param spaceId - The space ID in any supported format
 * @returns bytes16 hex string (0x + 32 hex chars)
 * @throws Error if the space ID format is invalid
 *
 * @example
 * ```typescript
 * parseSpaceId('550e8400-e29b-41d4-a716-446655440000');
 * // Returns: '0x550e8400e29b41d4a716446655440000'
 *
 * parseSpaceId('0x550e8400e29b41d4a716446655440000');
 * // Returns: '0x550e8400e29b41d4a716446655440000'
 * ```
 */
export function parseSpaceId(spaceId: string): Hex {
  // Remove dashes if present (UUID format)
  let normalized = spaceId.replace(/-/g, '');

  // Remove 0x prefix if present
  if (normalized.startsWith('0x')) {
    normalized = normalized.slice(2);
  }

  // Validate length (should be 32 hex characters for bytes16)
  if (normalized.length !== 32) {
    throw new Error(
      `Invalid space ID length: expected 32 hex chars, got ${normalized.length}. ` + `Input: "${spaceId}"`,
    );
  }

  // Validate hex characters
  if (!/^[0-9a-fA-F]+$/.test(normalized)) {
    throw new Error(`Invalid space ID: contains non-hex characters. Input: "${spaceId}"`);
  }

  return `0x${normalized.toLowerCase()}` as Hex;
}

/**
 * Converts a bytes16 hex space ID to a UUID string (without dashes).
 *
 * @param hex - The space ID in bytes16 hex format
 * @returns UUID string without dashes
 *
 * @example
 * ```typescript
 * hexToUuid('0x550e8400e29b41d4a716446655440000');
 * // Returns: '550e8400e29b41d4a716446655440000'
 * ```
 */
export function hexToUuid(hex: Hex): string {
  // Remove 0x prefix and return first 32 chars (bytes16)
  return hex.slice(2, 34).toLowerCase();
}

/**
 * Converts a bytes16 hex space ID to a formatted UUID string (with dashes).
 *
 * @param hex - The space ID in bytes16 hex format
 * @returns UUID string with dashes (8-4-4-4-12 format)
 *
 * @example
 * ```typescript
 * hexToFormattedUuid('0x550e8400e29b41d4a716446655440000');
 * // Returns: '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export function hexToFormattedUuid(hex: Hex): string {
  const uuid = hexToUuid(hex);
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}
