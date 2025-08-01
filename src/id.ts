
import { Brand } from 'effect';
import { validate as uuidValidate } from 'uuid';

export type Id = string & Brand.Brand<'Id'>;

export const Id = Brand.refined<Id>(
  id => isValid(id),
  id => Brand.error(`Expected ${id} to be a valid Id`),
);

export function isValid(id: string): boolean {
  return uuidValidate(id);
}