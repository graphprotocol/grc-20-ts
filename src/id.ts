import { Brand } from 'effect';
import { validate as uuidValidate } from 'uuid';

/**
 * A globally unique knowledge graph identifier.
 *
 * Canonical form is a UUID v4 **without dashes** (32 hex chars).
 * For compatibility, UUIDs **with dashes** are also accepted anywhere an `Id` is validated.
 */
export type Id = string & Brand.Brand<'Id'>;

export const Id = Brand.refined<Id>(
  id => isValid(id),
  id => Brand.error(`Expected ${id} to be a valid Id`),
);

const UUID_DASHLESS_REGEX = /^[0-9a-fA-F]{32}$/;

function dashlessToDashed(id: string): string | null {
  if (!UUID_DASHLESS_REGEX.test(id)) return null;
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

export function isValid(id: string): boolean {
  if (uuidValidate(id)) return true;

  const dashed = dashlessToDashed(id);
  if (!dashed) return false;

  return uuidValidate(dashed);
}
