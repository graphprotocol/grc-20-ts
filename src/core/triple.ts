/**
 * This module provides utility functions for working with Triples in TypeScript.
 *
 * @since 0.0.6
 */

import type { DeleteTripleOp, SetTripleOp, Value } from '../types.js';

type CreateTripleParams = {
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
 * @param args – {@link CreateTripleParams}
 * @returns – {@link SetTripleOp}
 */
export function make(args: CreateTripleParams): SetTripleOp {
  return {
    type: 'SET_TRIPLE',
    triple: {
      attribute: args.attributeId,
      entity: args.entityId,
      value: args.value,
    },
  };
}

type DeleteTripleParams = {
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
 * @param args – {@link DeleteTripleParams}
 * @returns – {@link DeleteTripleOp}
 */
export function remove(args: DeleteTripleParams): DeleteTripleOp {
  return {
    type: 'DELETE_TRIPLE',
    triple: {
      attribute: args.attributeId,
      entity: args.entityId,
    },
  };
}
