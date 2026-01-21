import {
  decodeEdit,
  encodeEdit,
  formatId,
  type Edit as GrcEdit,
  type Id as GrcId,
  type Op,
  parseId,
} from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';

// Helper to convert string ID to GRC-20 Id
function toGrcId(id: string): GrcId {
  const parsed = parseId(id);
  if (!parsed) throw new Error(`Invalid ID: ${id}`);
  return parsed;
}

describe('GRC-20 v2 Encoding', () => {
  describe('createEntity ops', () => {
    it('encodes and decodes createEntity with text value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const languageId = toGrcId('a6104fe0d6954f9392fa0a1afc552bc5');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'text',
                  value: 'test value',
                  language: languageId,
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.name).toBe('test');
      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('createEntity');

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(formatId(op.id)).toBe('3af3e22d21694a078681516710b7ecf1');
      expect(op.values.length).toBe(1);
      expect(op.values[0]?.value.type).toBe('text');
      if (op.values[0]?.value.type === 'text') {
        expect(op.values[0].value.value).toBe('test value');
      }
    });

    it('encodes and decodes createEntity with float64 value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const unitId = toGrcId('a6104fe0d6954f9392fa0a1afc552bc5');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'float64',
                  value: 42.5,
                  unit: unitId,
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.name).toBe('test');
      expect(decoded.ops.length).toBe(1);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('float64');
      if (op.values[0]?.value.type === 'float64') {
        expect(op.values[0].value.value).toBe(42.5);
      }
    });

    it('encodes and decodes createEntity with bool value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'bool',
                  value: true,
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('bool');
      if (op.values[0]?.value.type === 'bool') {
        expect(op.values[0].value.value).toBe(true);
      }
    });

    it('encodes and decodes createEntity with point value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'point',
                  lon: -122.4194,
                  lat: 37.7749,
                  alt: 10.5,
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('point');
      if (op.values[0]?.value.type === 'point') {
        expect(op.values[0].value.lon).toBeCloseTo(-122.4194, 4);
        expect(op.values[0].value.lat).toBeCloseTo(37.7749, 4);
        expect(op.values[0].value.alt).toBeCloseTo(10.5, 1);
      }
    });

    it('encodes and decodes createEntity with date value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'date',
                  value: '2024-01-15',
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('date');
      if (op.values[0]?.value.type === 'date') {
        expect(op.values[0].value.value).toBe('2024-01-15');
      }
    });

    it('encodes and decodes createEntity with time value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'time',
                  value: '14:30:00Z',
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('time');
      if (op.values[0]?.value.type === 'time') {
        expect(op.values[0].value.value).toBe('14:30:00Z');
      }
    });

    it('encodes and decodes createEntity with datetime value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'datetime',
                  value: '2024-01-15T14:30:00Z',
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('datetime');
      if (op.values[0]?.value.type === 'datetime') {
        expect(op.values[0].value.value).toBe('2024-01-15T14:30:00Z');
      }
    });

    it('encodes and decodes createEntity with schedule value', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId,
            values: [
              {
                property: propertyId,
                value: {
                  type: 'schedule',
                  value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
                },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createEntity' }>;
      expect(op.values[0]?.value.type).toBe('schedule');
      if (op.values[0]?.value.type === 'schedule') {
        expect(op.values[0].value.value).toBe('FREQ=WEEKLY;BYDAY=MO,WE,FR');
      }
    });
  });

  describe('relation ops', () => {
    it('encodes and decodes createRelation', () => {
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const relationTypeId = toGrcId('cf518eafef744aadbc87fe09c2631fcd');
      const fromEntityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const toEntityId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const entityId = toGrcId('a6104fe0d6954f9392fa0a1afc552bc5');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createRelation',
            id: relationId,
            relationType: relationTypeId,
            from: fromEntityId,
            to: toEntityId,
            entity: entityId,
            position: 'test-position',
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.name).toBe('test');
      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('createRelation');

      const op = decoded.ops[0] as Extract<Op, { type: 'createRelation' }>;
      expect(formatId(op.id)).toBe('765564cac7e54c61b1dcc28ab77ec6b7');
      expect(formatId(op.relationType)).toBe('cf518eafef744aadbc87fe09c2631fcd');
      expect(formatId(op.from)).toBe('3af3e22d21694a078681516710b7ecf1');
      expect(formatId(op.to)).toBe('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      expect(op.position).toBe('test-position');
    });

    it('encodes and decodes createRelation with space pins', () => {
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const relationTypeId = toGrcId('cf518eafef744aadbc87fe09c2631fcd');
      const fromEntityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const toEntityId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const fromSpaceId = toGrcId('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      const toSpaceId = toGrcId('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createRelation',
            id: relationId,
            relationType: relationTypeId,
            from: fromEntityId,
            to: toEntityId,
            fromSpace: fromSpaceId,
            toSpace: toSpaceId,
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'createRelation' }>;
      expect(op.fromSpace).toBeDefined();
      expect(op.toSpace).toBeDefined();
      if (op.fromSpace) expect(formatId(op.fromSpace)).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      if (op.toSpace) expect(formatId(op.toSpace)).toBe('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    });

    it('encodes and decodes deleteRelation', () => {
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'deleteRelation',
            id: relationId,
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('deleteRelation');

      const op = decoded.ops[0] as Extract<Op, { type: 'deleteRelation' }>;
      expect(formatId(op.id)).toBe('765564cac7e54c61b1dcc28ab77ec6b7');
    });

    it('encodes and decodes updateRelation', () => {
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'updateRelation',
            id: relationId,
            position: 'new-position',
            unset: [],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('updateRelation');

      const op = decoded.ops[0] as Extract<Op, { type: 'updateRelation' }>;
      expect(formatId(op.id)).toBe('765564cac7e54c61b1dcc28ab77ec6b7');
      expect(op.position).toBe('new-position');
    });

    it('encodes and decodes updateRelation with unset fields', () => {
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'updateRelation',
            id: relationId,
            unset: ['fromSpace', 'toSpace', 'position'],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      const op = decoded.ops[0] as Extract<Op, { type: 'updateRelation' }>;
      expect(op.unset).toContain('fromSpace');
      expect(op.unset).toContain('toSpace');
      expect(op.unset).toContain('position');
    });
  });

  describe('entity ops', () => {
    it('encodes and decodes updateEntity with set and unset', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const propertyId = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const unsetPropertyId = toGrcId('a6104fe0d6954f9392fa0a1afc552bc5');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'updateEntity',
            id: entityId,
            set: [
              {
                property: propertyId,
                value: {
                  type: 'text',
                  value: 'updated value',
                },
              },
            ],
            unset: [
              {
                property: unsetPropertyId,
                language: { type: 'all' },
              },
            ],
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('updateEntity');

      const op = decoded.ops[0] as Extract<Op, { type: 'updateEntity' }>;
      expect(formatId(op.id)).toBe('3af3e22d21694a078681516710b7ecf1');
      expect(op.set.length).toBe(1);
      expect(op.unset.length).toBe(1);
    });

    it('encodes and decodes deleteEntity', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'deleteEntity',
            id: entityId,
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('deleteEntity');

      const op = decoded.ops[0] as Extract<Op, { type: 'deleteEntity' }>;
      expect(formatId(op.id)).toBe('3af3e22d21694a078681516710b7ecf1');
    });

    it('encodes and decodes restoreEntity', () => {
      const entityId = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'restoreEntity',
            id: entityId,
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.ops.length).toBe(1);
      expect(decoded.ops[0]?.type).toBe('restoreEntity');

      const op = decoded.ops[0] as Extract<Op, { type: 'restoreEntity' }>;
      expect(formatId(op.id)).toBe('3af3e22d21694a078681516710b7ecf1');
    });
  });

  describe('multiple ops', () => {
    it('encodes and decodes edit with multiple ops', () => {
      const entityId1 = toGrcId('3af3e22d21694a078681516710b7ecf1');
      const entityId2 = toGrcId('d4bc2f205e2d415e971eb0b9fbf6b6fc');
      const propertyId = toGrcId('a6104fe0d6954f9392fa0a1afc552bc5');
      const relationId = toGrcId('765564cac7e54c61b1dcc28ab77ec6b7');
      const relationTypeId = toGrcId('cf518eafef744aadbc87fe09c2631fcd');
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'multi-op test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [
          {
            type: 'createEntity',
            id: entityId1,
            values: [
              {
                property: propertyId,
                value: { type: 'text', value: 'Entity 1' },
              },
            ],
          },
          {
            type: 'createEntity',
            id: entityId2,
            values: [
              {
                property: propertyId,
                value: { type: 'text', value: 'Entity 2' },
              },
            ],
          },
          {
            type: 'createRelation',
            id: relationId,
            relationType: relationTypeId,
            from: entityId1,
            to: entityId2,
          },
        ],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.name).toBe('multi-op test');
      expect(decoded.ops.length).toBe(3);
      expect(decoded.ops[0]?.type).toBe('createEntity');
      expect(decoded.ops[1]?.type).toBe('createEntity');
      expect(decoded.ops[2]?.type).toBe('createRelation');
    });
  });

  describe('edit metadata', () => {
    it('preserves edit id', () => {
      const editId = toGrcId('abcdef12345678901234567890abcdef');
      const authorId = toGrcId('22222222222222222222222222222222');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: BigInt(1000000),
        ops: [],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(formatId(decoded.id)).toBe('abcdef12345678901234567890abcdef');
    });

    it('preserves multiple authors', () => {
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId1 = toGrcId('22222222222222222222222222222222');
      const authorId2 = toGrcId('33333333333333333333333333333333');

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId1, authorId2],
        createdAt: BigInt(1000000),
        ops: [],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.authors.length).toBe(2);
      const author0 = decoded.authors[0];
      const author1 = decoded.authors[1];
      if (!author0 || !author1) throw new Error('Expected authors to be defined');
      expect(formatId(author0)).toBe('22222222222222222222222222222222');
      expect(formatId(author1)).toBe('33333333333333333333333333333333');
    });

    it('preserves createdAt timestamp', () => {
      const editId = toGrcId('11111111111111111111111111111111');
      const authorId = toGrcId('22222222222222222222222222222222');
      const timestamp = BigInt(1705334400000000); // 2024-01-15 in microseconds

      const edit: GrcEdit = {
        id: editId,
        name: 'test',
        authors: [authorId],
        createdAt: timestamp,
        ops: [],
      };

      const binary = encodeEdit(edit);
      const decoded = decodeEdit(binary);

      expect(decoded.createdAt).toBe(timestamp);
    });
  });
});
