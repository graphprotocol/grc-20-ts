import type { JsonValue } from "@bufbuild/protobuf";
import { Id } from '../id.js';
import { generate, toBase64, toBytes } from '../id-utils.js';
import type {
  DataType,
  Entity,
  Op,
  Relation,
  UnsetEntityValuesOp,
  UnsetRelationFieldsOp,
  UpdateRelationOp,
  ValueOptions,
} from "../types.js";
import {
  Edit,
  Entity as EntityProto,
  Op as OpBinary,
  Property,
  Relation as RelationProto,
  RelationUpdate,
  UnsetEntityValues,
  UnsetRelationFields,
} from "./gen/src/proto/ipfs_pb.js";

type MakeEditProposalParams = {
  name: string;
  ops: Op[];
  author: `0x${string}`;
  language?: Id;
};

function hexToBytes(hex: string): Uint8Array {
  let hexString = hex;
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string: must have an even length");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export function encode({
  name,
  ops,
  author,
  language,
}: MakeEditProposalParams): Uint8Array {
  return new Edit({
    id: toBytes(generate()),
    name,
    ops: opsToBinary(ops),
    authors: [hexToBytes(author)],
    language: language ? toBytes(language) : undefined,
  }).toBinary();
}

function convertRelationIdsToBase64(relation: Relation): JsonValue {
  const result: Record<string, string | boolean> = {
    id: toBase64(relation.id),
    type: toBase64(relation.type),
    from_entity: toBase64(relation.fromEntity),
    to_entity: toBase64(relation.toEntity),
    entity: toBase64(relation.entity),
  };

  if (relation.fromSpace) {
    result.from_space = toBase64(relation.fromSpace);
  }
  if (relation.fromVersion) {
    result.from_version = toBase64(relation.fromVersion);
  }
  if (relation.toSpace) {
    result.to_space = toBase64(relation.toSpace);
  }
  if (relation.toVersion) {
    result.to_version = toBase64(relation.toVersion);
  }
  if (relation.position !== undefined) {
    result.position = relation.position;
  }
  if (relation.verified !== undefined) {
    result.verified = relation.verified;
  }

  return result;
}

function convertUnsetEntityValuesToBase64(
  unsetEntityValues: UnsetEntityValuesOp["unsetEntityValues"]
): JsonValue {
  return {
    id: toBase64(unsetEntityValues.id),
    properties: unsetEntityValues.properties.map((propertyId) =>
      toBase64(propertyId)
    ),
  };
}

function convertUpdateRelationToBase64(
  relation: UpdateRelationOp["relation"]
): JsonValue {
  const result: Record<string, string | boolean> = {
    id: toBase64(relation.id),
  };

  if (relation.fromSpace) {
    result.from_space = toBase64(relation.fromSpace);
  }
  if (relation.fromVersion) {
    result.from_version = toBase64(relation.fromVersion);
  }
  if (relation.toSpace) {
    result.to_space = toBase64(relation.toSpace);
  }
  if (relation.toVersion) {
    result.to_version = toBase64(relation.toVersion);
  }
  if (relation.position !== undefined) {
    result.position = relation.position;
  }
  if (relation.verified !== undefined) {
    result.verified = relation.verified;
  }

  return result;
}

function convertUnsetRelationFieldsToBase64(
  unsetRelationFields: UnsetRelationFieldsOp["unsetRelationFields"]
): JsonValue {
  const result: Record<string, string | boolean> = {
    id: toBase64(unsetRelationFields.id),
  };

  if (unsetRelationFields.fromSpace !== undefined) {
    result.from_space = unsetRelationFields.fromSpace;
  }
  if (unsetRelationFields.fromVersion !== undefined) {
    result.from_version = unsetRelationFields.fromVersion;
  }
  if (unsetRelationFields.toSpace !== undefined) {
    result.to_space = unsetRelationFields.toSpace;
  }
  if (unsetRelationFields.toVersion !== undefined) {
    result.to_version = unsetRelationFields.toVersion;
  }
  if (unsetRelationFields.position !== undefined) {
    result.position = unsetRelationFields.position;
  }
  if (unsetRelationFields.verified !== undefined) {
    result.verified = unsetRelationFields.verified;
  }

  return result;
}

function convertUpdateEntityToBase64(entity: Entity): JsonValue {
  return {
    id: toBase64(entity.id).toString(),
    values: entity.values.map((value) => {
      let options: ValueOptions | undefined;
      if (value.options) {
        if (value.options.text) {
          options = {
            text: {
              ...(value.options.text.language
                ? {
                    language: toBase64(
                      Id(value.options.text.language)
                    ).toString(),
                  }
                : null),
            },
          };
        } else if (value.options.number) {
          options = {
            number: {
              ...(value.options.number.unit
                ? { unit: toBase64(Id(value.options.number.unit)).toString() }
                : {}),
            },
          };
        }
      }

      const valueEntry: JsonValue = {
        property: toBase64(value.property).toString(),
        value: value.value,
      };
      if (options) {
        valueEntry.options = options;
      }
      return valueEntry;
    }),
  };
}

function convertPropertyToBase64(property: {
  id: Id;
  dataType: DataType;
}): JsonValue {
  return {
    id: toBase64(property.id).toString(),
    dataType: property.dataType,
  };
}

function opsToBinary(ops: Op[]): OpBinary[] {
  return ops.map((o) => {
    switch (o.type) {
      case "CREATE_RELATION":
        return new OpBinary({
          payload: {
            case: "createRelation",
            value: RelationProto.fromJson(
              convertRelationIdsToBase64(o.relation)
            ),
          },
        });
      case "CREATE_PROPERTY":
        return new OpBinary({
          payload: {
            case: "createProperty",
            value: Property.fromJson(convertPropertyToBase64(o.property)),
          },
        });
      case "DELETE_RELATION":
        return new OpBinary({
          payload: {
            case: "deleteRelation",
            value: toBytes(o.id),
          },
        });
      case "UPDATE_ENTITY":
        return new OpBinary({
          payload: {
            case: "updateEntity",
            value: EntityProto.fromJson(convertUpdateEntityToBase64(o.entity)),
          },
        });
      case "UNSET_ENTITY_VALUES":
        return new OpBinary({
          payload: {
            case: "unsetEntityValues",
            value: UnsetEntityValues.fromJson(
              convertUnsetEntityValuesToBase64(o.unsetEntityValues)
            ),
          },
        });
      case "UPDATE_RELATION":
        return new OpBinary({
          payload: {
            case: "updateRelation",
            value: RelationUpdate.fromJson(
              convertUpdateRelationToBase64(o.relation)
            ),
          },
        });
      case "UNSET_RELATION_FIELDS":
        return new OpBinary({
          payload: {
            case: "unsetRelationFields",
            value: UnsetRelationFields.fromJson(
              convertUnsetRelationFieldsToBase64(o.unsetRelationFields)
            ),
          },
        });
    }
  });
}
