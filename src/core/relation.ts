/**
 * This module provides utility functions for working with Relations in TypeScript.
 *
 * @since 0.0.6
 */

import { INITIAL_RELATION_INDEX_VALUE } from '../../constants.js';
import { generate } from '../id.js';
import { SystemIds } from '../system-ids.js';
import type { CreateRelationOp, DeleteRelationOp } from '../types.js';
import { Position } from './position.js';

/**
 * Arguments for creating a new Relation.
 *
 * @param relationId - optional base58 encoded v4 uuid
 * @param fromId - base58 encoded v4 uuid
 * @param toId - base58 encoded v4 uuid
 * @param relationTypeId - base58 encoded v4 uuid
 * @param position - optional fractional index using position-strings
 */
type CreateRelationArgs = {
  relationId?: string;
  fromId: string;
  toId: string;
  relationTypeId: string;
  position?: string;
};

/**
 * Generates ops for a new Relation.
 *
 * @example
 * ```ts
 * const ops = Relation.make({
 *   fromId: 'from-id',
 *   toId: 'to-id',
 *   relationTypeId: 'relation-type-id',
 *   // optional
 *   relationId: 'relation-id',
 *   position: 'position-string',
 * });
 * ```
 *
 * @param args {@link CreateRelationArgs}
 * @returns – {@link CreateRelationOp}
 */
export function make(args: CreateRelationArgs): CreateRelationOp {
  const newEntityId = args.relationId ?? generate();

  return {
    type: 'CREATE_RELATION',
    relation: {
      id: newEntityId,
      type: args.relationTypeId,
      fromEntity: args.fromId,
      toEntity: args.toId,
      index: args.position ?? INITIAL_RELATION_INDEX_VALUE,
    },
  };
}

/**
 * Generates ops for deleting a Relation.
 *
 * @example
 * ```ts
 * const op = Relation.remove('relation-id');
 * ```
 *
 * @param relationId – base58 encoded v4 uuid representing the relation's entity id
 * @returns – {@link DeleteRelationOp}
 */
export function remove(relationId: string): DeleteRelationOp {
  return {
    type: 'DELETE_RELATION',
    relation: {
      id: relationId,
    },
  };
}

type ReorderRelationArgs = {
  relationId: string;
  beforeIndex?: string;
  afterIndex?: string;
};

type ReorderRelationOp = {
  type: 'SET_TRIPLE';
  triple: {
    attribute: typeof SystemIds.RELATION_INDEX;
    entity: string;
    value: {
      type: 'TEXT';
      value: string;
    };
  };
};

/**
 * Generates op for reordering a Relation using position-strings
 *
 * @example
 * ```ts
 * const op = Relation.reorder({
 *   relationId: 'relation-id',
 *   beforeIndex: 'before-position',
 *   afterIndex: 'after-position',
 * });
 * ```
 *
 * @param args {@link ReorderRelationArgs}
 * @returns – {@link ReorderRelationOp}
 */
export function reorder(args: ReorderRelationArgs): ReorderRelationOp {
  const newIndex = Position.createBetween(args.beforeIndex, args.afterIndex);

  return {
    type: 'SET_TRIPLE',
    triple: {
      attribute: SystemIds.RELATION_INDEX,
      entity: args.relationId,
      value: {
        type: 'TEXT',
        value: newIndex,
      },
    },
  };
}
