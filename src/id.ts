import { Brand } from 'effect';
import { validate as uuidValidate } from 'uuid';
import { dashlessUuidToDashed } from './internal/uuid.js';

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

export function isValid(id: string): boolean {
  if (uuidValidate(id)) return true;

  const dashed = dashlessUuidToDashed(id);
  if (!dashed) return false;

  return uuidValidate(dashed);
}
