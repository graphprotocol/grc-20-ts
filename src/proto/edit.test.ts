import { describe, expect, it } from 'vitest';

import { Id, toBytes } from '../id.js';
import { encode } from './edit.js';
import { Edit } from './gen/src/proto/ipfs_pb.js';

describe('Edit', () => {
  it('encodes and decodes Edit with UPDATE_ENTITY ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'UPDATE_ENTITY',
          entity: {
            id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            values: [
              {
                property: Id('d4bc2f20-5e2d-415e-971e-b0b9fbf6b6fc'),
                value: 'test value',
                options: {
                  text: {
                    language: Id('a6104fe0-d695-4f93-92fa-0a1afc552bc5'),
                  },
                },
              },
            ],
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('updateEntity');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      values: [
        {
          property: toBytes(Id('d4bc2f20-5e2d-415e-971e-b0b9fbf6b6fc')),
          value: 'test value',
          options: {
            value: {
              case: 'text',
              value: {
                language: toBytes(Id('a6104fe0-d695-4f93-92fa-0a1afc552bc5')),
              },
            },
          },
        },
      ],
    });
  });

  it('encodes and decodes an edit with a CREATE_PROPERTY ops with a point type correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'CREATE_PROPERTY',
          property: {
            id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            type: 'POINT',
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('createProperty');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      type: 4,
    });
  });

  it('encodes and decodes an edit with a CREATE_PROPERTY ops with a relation type correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'CREATE_PROPERTY',
          property: {
            id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            type: 'RELATION',
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('createProperty');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      type: 5,
    });
  });

  it('encodes and decodes an edit with a CREATE_PROPERTY ops with a text type correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'CREATE_PROPERTY',
          property: {
            id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            type: 'TEXT',
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('createProperty');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      type: 0,
    });
  });

  it('encodes and decodes Edit with DELETE_ENTITY ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'DELETE_ENTITY',
          id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('deleteEntity');
    expect(op.payload?.value).toEqual(toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')));
  });

  it('encodes and decodes Edit with CREATE_RELATION ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'CREATE_RELATION',
          relation: {
            id: Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7'),
            type: Id('cf518eaf-ef74-4aad-bc87-fe09c2631fcd'),
            fromEntity: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            toEntity: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            entity: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            position: 'test-position',
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('createRelation');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')),
      type: toBytes(Id('cf518eaf-ef74-4aad-bc87-fe09c2631fcd')),
      fromEntity: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      toEntity: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      entity: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      position: 'test-position',
    });
  });

  it('encodes and decodes Edit with DELETE_RELATION ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'DELETE_RELATION',
          id: Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7'),
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('deleteRelation');
    expect(op.payload?.value).toEqual(toBytes(Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')));
  });

  it('encodes and decodes Edit with UPDATE_RELATION ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'UPDATE_RELATION',
          relation: {
            id: Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7'),
            position: 'new-position',
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('updateRelation');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')),
      position: 'new-position',
    });
  });

  it('encodes and decodes Edit with UNSET_ENTITY_VALUES ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'UNSET_ENTITY_VALUES',
          unsetEntityValues: {
            id: Id('3af3e22d-2169-4a07-8681-516710b7ecf1'),
            properties: [Id('d4bc2f20-5e2d-415e-971e-b0b9fbf6b6fc'), Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')],
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('unsetEntityValues');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('3af3e22d-2169-4a07-8681-516710b7ecf1')),
      properties: [
        toBytes(Id('d4bc2f20-5e2d-415e-971e-b0b9fbf6b6fc')),
        toBytes(Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')),
      ],
    });
  });

  it('encodes and decodes Edit with UNSET_RELATION_FIELDS ops correctly', () => {
    const editBinary = encode({
      name: 'test',
      ops: [
        {
          type: 'UNSET_RELATION_FIELDS',
          unsetRelationFields: {
            id: Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7'),
            fromSpace: true,
            fromVersion: false,
            toSpace: true,
            toVersion: false,
            position: true,
            verified: false,
          },
        },
      ],
      author: '0x000000000000000000000000000000000000',
    });

    const result = Edit.fromBinary(editBinary);
    expect(result.name).toBe('test');
    expect(result.ops.length).toBe(1);
    const op = result.ops[0];
    if (!op) throw new Error('Expected op to be defined');
    expect(op.payload?.case).toBe('unsetRelationFields');
    expect(op.payload?.value).toEqual({
      id: toBytes(Id('765564ca-c7e5-4c61-b1dc-c28ab77ec6b7')),
      fromSpace: true,
      fromVersion: false,
      toSpace: true,
      toVersion: false,
      position: true,
      verified: false,
    });
  });
});
