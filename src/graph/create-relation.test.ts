import type { CreateEntity, CreateRelation, Op } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { CLAIM_TYPE, NEWS_STORY_TYPE } from '../core/ids/content.js';
import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { createRelation } from './create-relation.js';

const isCreateRelationOp = (op: Op): op is CreateRelation => {
  return op.type === 'createRelation';
};

const isCreateEntityOp = (op: Op): op is CreateEntity => {
  return op.type === 'createEntity';
};

describe('createRelation', () => {
  const fromEntityId = Id('30145d36d5a54244be593d111d879ba5');
  const toEntityId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
  const coverId = Id('fa269fd3de9849cf90c44235d905a67c');
  const testSpaceId = Id('c1dc6e5c63e143bab3d4755b251a4ea2');
  const fromSpaceId = Id('d1dc6e5c63e143bab3d4755b251a4ea3');
  const fromVersionId = Id('e1dc6e5c63e143bab3d4755b251a4ea4');
  const toVersionId = Id('f1dc6e5c63e143bab3d4755b251a4ea5');

  it('creates a basic relation without additional properties', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(typeof relation.id).toBe('string');
    expect(relation.ops).toBeDefined();
    expect(relation.ops).toHaveLength(1); // One createRelation op

    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(isCreateRelationOp(relOp)).toBe(true);
    expect(relOp.id).toEqual(toGrcId(relation.id));
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));
  });

  it('creates a relation with position and toSpace', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      position: '1',
      toSpace: testSpaceId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);

    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));
    expect(relOp.position).toBe('1');
    expect(relOp.toSpace).toEqual(toGrcId(testSpaceId));
  });

  it('creates a relation with fromSpace, fromVersion, and toVersion', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      fromSpace: fromSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);

    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));
    expect(relOp.fromSpace).toEqual(toGrcId(fromSpaceId));
    expect(relOp.fromVersion).toEqual(toGrcId(fromVersionId));
    expect(relOp.toVersion).toEqual(toGrcId(toVersionId));
  });

  it('creates a relation with all optional fields', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      position: '1',
      fromSpace: fromSpaceId,
      toSpace: testSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);

    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.id).toEqual(toGrcId(relation.id));
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));
    expect(relOp.position).toBe('1');
    expect(relOp.fromSpace).toEqual(toGrcId(fromSpaceId));
    expect(relOp.toSpace).toEqual(toGrcId(testSpaceId));
    expect(relOp.fromVersion).toEqual(toGrcId(fromVersionId));
    expect(relOp.toVersion).toEqual(toGrcId(toVersionId));
  });

  it('creates a relation with a provided id', async () => {
    const providedId = Id('c1dc6e5c63e143bab3d4755b251a4ea1');
    const relation = createRelation({
      id: providedId,
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(relation.id).toBe(providedId);
    expect(relation.ops).toHaveLength(1);

    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.id).toEqual(toGrcId(providedId));
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));
  });

  it('creates a relation with an entity that has name and description', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityName: 'Test Entity',
      entityDescription: 'Test Description',
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));
    expect(relOp.relationType).toEqual(toGrcId(NAME_PROPERTY));

    // Check createEntity op
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(isCreateEntityOp(entityOp)).toBe(true);

    // Verify name value
    const nameValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
    });
    expect(nameValue).toBeDefined();
    expect(nameValue?.value.type).toBe('text');
    if (nameValue?.value.type === 'text') {
      expect(nameValue.value.value).toBe('Test Entity');
    }

    // Verify description value
    const descValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(DESCRIPTION_PROPERTY)[i]);
    });
    expect(descValue).toBeDefined();
    expect(descValue?.value.type).toBe('text');
    if (descValue?.value.type === 'text') {
      expect(descValue.value.value).toBe('Test Description');
    }
  });

  it('creates a relation with an entity that has types', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityTypes: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(4); // createRelation + createEntity + two type relations

    // Check createRelation op
    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));

    // Check createEntity op
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    // Check type relations
    const typeRel1 = relation.ops[2] as CreateRelation;
    expect(typeRel1.type).toBe('createRelation');
    expect(typeRel1.to).toEqual(toGrcId(CLAIM_TYPE));
    expect(typeRel1.relationType).toEqual(toGrcId(TYPES_PROPERTY));

    const typeRel2 = relation.ops[3] as CreateRelation;
    expect(typeRel2.type).toBe('createRelation');
    expect(typeRel2.to).toEqual(toGrcId(NEWS_STORY_TYPE));
    expect(typeRel2.relationType).toEqual(toGrcId(TYPES_PROPERTY));
  });

  it('creates a relation with an entity that has a cover', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityCover: coverId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(3); // createRelation + createEntity + cover relation

    // Check createRelation op
    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));

    // Check createEntity op
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    // Check cover relation
    const coverRel = relation.ops[2] as CreateRelation;
    expect(coverRel.type).toBe('createRelation');
    expect(coverRel.to).toEqual(toGrcId(coverId));
    expect(coverRel.relationType).toEqual(toGrcId(COVER_PROPERTY));
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() =>
      createRelation({
        id: 'invalid',
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      }),
    ).toThrow('Invalid id: "invalid" for `id` in `createRelation`');
  });

  it('throws an error if fromSpace is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        fromSpace: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromSpace` in `createRelation`');
  });

  it('throws an error if fromVersion is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        fromVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromVersion` in `createRelation`');
  });

  it('throws an error if toVersion is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        toVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `toVersion` in `createRelation`');
  });

  it('creates a relation with entityValues', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityValues: [{ property: customPropertyId, type: 'text', value: 'custom value' }],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');
    expect(relOp.from).toEqual(toGrcId(fromEntityId));
    expect(relOp.to).toEqual(toGrcId(toEntityId));

    // Check createEntity op with custom value
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const customValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(customPropertyId)[i]);
    });
    expect(customValue).toBeDefined();
    expect(customValue?.value.type).toBe('text');
    if (customValue?.value.type === 'text') {
      expect(customValue.value.value).toBe('custom value');
    }
  });

  it('creates a relation with entityValues that have language', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const languageId = Id('0a4e9810f78f429ea4ceb1904a43251d');
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityValues: [
        {
          property: customPropertyId,
          type: 'text',
          value: 'test',
          language: languageId,
        },
      ],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    const relOp = relation.ops[0] as CreateRelation;
    expect(relOp.type).toBe('createRelation');

    // Check createEntity op
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const textValue = entityOp.values[0];
    expect(textValue?.value.type).toBe('text');
    if (textValue?.value.type === 'text') {
      expect(textValue.value.value).toBe('test');
      expect(textValue.value.language).toEqual(toGrcId(languageId));
    }
  });

  it('throws an error if entityValues property is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        entityValues: [{ property: 'invalid', type: 'text', value: 'test' }],
      }),
    ).toThrow('Invalid id: "invalid" for `entityValues` in `createRelation`');
  });

  it('throws an error if toSpace is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        toSpace: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `toSpace` in `createRelation`');
  });

  it('throws an error if entityCover is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        entityCover: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `entityCover` in `createRelation`');
  });

  it('creates a relation with entityRelations (nested relations)', () => {
    const outerRelationType = Id('295c8bc61ae342cbb2a65b61080906ff');
    const innerToEntityId = Id('a1dc6e5c63e143bab3d4755b251a4ea6');
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityRelations: {
        [outerRelationType]: {
          toEntity: innerToEntityId,
        },
      },
    });

    expect(relation).toBeDefined();
    // 1 createRelation (main) + 1 createEntity (main entity) + 1 createRelation (nested)
    expect(relation.ops).toHaveLength(3);

    // Check main createRelation op
    const mainRelOp = relation.ops[0] as CreateRelation;
    expect(mainRelOp.type).toBe('createRelation');
    expect(mainRelOp.from).toEqual(toGrcId(fromEntityId));
    expect(mainRelOp.to).toEqual(toGrcId(toEntityId));
    expect(mainRelOp.relationType).toEqual(toGrcId(NAME_PROPERTY));

    // Check main createEntity op
    const entityOp = relation.ops[1] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    // Check nested createRelation op
    const nestedRelOp = relation.ops[2] as CreateRelation;
    expect(nestedRelOp.type).toBe('createRelation');
    expect(nestedRelOp.to).toEqual(toGrcId(innerToEntityId));
    expect(nestedRelOp.relationType).toEqual(toGrcId(outerRelationType));
  });
});
