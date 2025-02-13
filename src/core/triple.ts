/**
 * This module provides utility functions for working with Triples in TypeScript.
 *
 * @since 0.0.6
 */

import type { DeleteTripleOp, SetTripleOp, Value } from '../types.js';

type CreateTripleArgs = {
  attributeId: string;
  entityId: string;
  value: Value;
};

/**
 * Generates op for creating a new Triple.
 *
 * @example
 * ```ts
 * const op = Triple.make({
 *   attributeId: 'attribute-id',
 *   entityId: 'entity-id',
 *   value: {
 *     type: 'TEXT',
 *     value: 'value',
 *   },
 * });
 * ```
 * @param args – {@link CreateTripleArgs}
 * @returns – {@link SetTripleOp}
 */
export function make(args: CreateTripleArgs): SetTripleOp {
  return {
    type: 'SET_TRIPLE',
    triple: {
      attribute: args.attributeId,
      entity: args.entityId,
      value: args.value,
    },
  };
}

type DeleteTripleArgs = {
  attributeId: string;
  entityId: string;
};

/**
 * Generates op for deleting a Triple.
 *
 * @example
 * ```ts
 * const op = Triple.remove({
 *   attributeId: 'attribute-id',
 *   entityId: 'entity-id',
 * });
 * ```
 *
 * @param args – {@link DeleteTripleArgs}
 * @returns – {@link DeleteTripleOp}
 */
export function remove(args: DeleteTripleArgs): DeleteTripleOp {
  return {
    type: 'DELETE_TRIPLE',
    triple: {
      attribute: args.attributeId,
      entity: args.entityId,
    },
  };
}
