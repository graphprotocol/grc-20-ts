import { gql, request } from 'graphql-request';
import { Relation } from '../relation.js';
import { Triple } from '../triple.js';
import type { Op } from '../types.js';

const ENDPOINT = 'https://kg.thegraph.com/graphql';

const deleteEntityQueryDocument = gql`
query deleteEntity($spaceId: String!, $id: String!) {
  entity(spaceId: $spaceId, id: $id) {
    attributes {
      attribute
    }
    relations {
      id
    }
  }
}
`;

type DeleteEntityResult = {
  entity: {
    attributes: {
      attribute: string;
    }[];
    relations: {
      id: string;
    }[];
  } | null;
};

/**
 * Deletes an entity from the graph.
 * 
 * @example
 * ```ts
 * const { ops } = await deleteEntity({ id: entityId, space: spaceId });
 * ```
 * 
 * @param id - The id of the entity to delete.
 * @param space - The space of the entity to delete.
 * @returns The operations to delete the entity.
 */
export const deleteEntity = async ({ id, space }: { id: string; space: string }) => {
  const result = await request<DeleteEntityResult>(ENDPOINT, deleteEntityQueryDocument, {
    id,
    spaceId: space,
  });
  if (result.entity === null) {
    throw new Error('Entity not found');
  }
  const ops: Op[] = [];
  for (const attribute of result.entity.attributes) {
    ops.push(Triple.remove({ attributeId: attribute.attribute, entityId: id }));
  }
  for (const relation of result.entity.relations) {
    ops.push(Relation.remove(relation.id));
  }
  return { ops };
};
