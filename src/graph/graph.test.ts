import { describe, expect, it } from 'vitest';
import type { Op } from '../types.js';
import { createEntity } from './create-entity.js';
import { createProperty } from './create-property.js';
import { createType } from './create-type.js';

describe('Graph', () => {
  it('creates types, entities and relations', async () => {
    const ops: Array<Op> = [];

    // create age property
    const { id: agePropertyId, ops: createAgePropertyOps } = createProperty({
      type: 'NUMBER',
      name: 'Age',
    });
    ops.push(...createAgePropertyOps);

    // create likes property
    const { id: likesPropertyId, ops: createLikesPropertyOps } = createProperty({
      type: 'RELATION',
      name: 'Likes',
    });
    ops.push(...createLikesPropertyOps);

    // create person type
    const { id: personTypeId, ops: createPersonTypeOps } = createType({
      name: 'Person',
      properties: [agePropertyId],
    });
    ops.push(...createPersonTypeOps);

    // create restaurant entity
    const { id: restaurantId, ops: createRestaurantOps } = createEntity({
      name: 'Restaurant',
      types: [personTypeId],
    });
    ops.push(...createRestaurantOps);

    // create person entity
    const { id: personId, ops: createPersonOps } = createEntity({
      name: 'Jane Doe',
      types: [personTypeId],
      properties: {
        [likesPropertyId]: {
          to: restaurantId,
        },
      },
    });
    ops.push(...createPersonOps);

    expect(ops.length).toBe(16);
  });
});
