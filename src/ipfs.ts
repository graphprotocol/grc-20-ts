/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import {
  derivedUuidFromString,
  encodeEdit,
  type Edit as GrcEdit,
  type Id as GrcId,
  type Op as GrcOp,
  type PropertyValue as GrcPropertyValue,
  languages,
  parseId,
  randomId,
  type UnsetRelationField,
} from '@geoprotocol/grc-20';
import { Micro } from 'effect';
import { gzipSync } from 'fflate';
import { imageSize } from 'image-size';

import { getApiOrigin, type Network } from './graph/constants.js';
import type { Id } from './id.js';
import { fromBytes, toBytes } from './id-utils.js';
import type { Op, Value } from './types.js';

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
}

/**
 * Converts a hex string (like an ethereum address) to a GRC-20 Id.
 * Uses derived UUID since ethereum addresses (20 bytes) don't fit directly into UUIDs (16 bytes).
 */
function hexToGrcId(hex: `0x${string}`): GrcId {
  return derivedUuidFromString(hex);
}

/**
 * Converts a local string Id to a GRC-20 Id (Uint8Array).
 */
function toGrcId(id: Id | string): GrcId {
  // Try to parse as a UUID string first
  const parsed = parseId(id);
  if (parsed) {
    return parsed;
  }
  // Fallback: use the toBytes helper
  return toBytes(id as Id) as GrcId;
}

/**
 * Converts a local Value to a GRC-20 Value.
 */
function convertValue(value: Value): GrcPropertyValue {
  const property = toGrcId(value.property);

  switch (value.type) {
    case 'bool':
      return { property, value: { type: 'bool', value: value.value } };
    case 'float64':
      return {
        property,
        value: {
          type: 'float64',
          value: value.value,
          ...(value.unit ? { unit: toGrcId(value.unit) } : {}),
        },
      };
    case 'text':
      return {
        property,
        value: {
          type: 'text',
          value: value.value,
          ...(value.language ? { language: toGrcId(value.language) } : { language: languages.english() }),
        },
      };
    case 'point':
      return {
        property,
        value: {
          type: 'point',
          lon: value.lon,
          lat: value.lat,
          ...(value.alt !== undefined ? { alt: value.alt } : {}),
        },
      };
    case 'date':
      return { property, value: { type: 'date', value: value.value } };
    case 'time':
      return { property, value: { type: 'time', value: value.value } };
    case 'datetime':
      return { property, value: { type: 'datetime', value: value.value } };
    case 'schedule':
      return { property, value: { type: 'schedule', value: value.value } };
    default:
      throw new Error(`Unsupported value type: ${(value as Value).type}`);
  }
}

/**
 * Converts local Op[] to GRC-20 Op[].
 */
function convertOps(ops: Op[]): GrcOp[] {
  const grcOps: GrcOp[] = [];

  for (const op of ops) {
    switch (op.type) {
      case 'UPDATE_ENTITY': {
        // UPDATE_ENTITY maps to createEntity (which acts as upsert)
        grcOps.push({
          type: 'createEntity',
          id: toGrcId(op.entity.id),
          values: op.entity.values.map(convertValue),
        });
        break;
      }
      case 'CREATE_RELATION': {
        const rel = op.relation;
        // Note: 'verified' field is not supported by GRC-20 v2 CreateRelation type
        if (rel.verified !== undefined) {
          console.warn("Warning: 'verified' field is not supported by GRC-20 v2 format and will be ignored");
        }
        grcOps.push({
          type: 'createRelation',
          id: toGrcId(rel.id),
          relationType: toGrcId(rel.type),
          from: toGrcId(rel.fromEntity),
          to: toGrcId(rel.toEntity),
          ...(rel.fromSpace ? { fromSpace: toGrcId(rel.fromSpace) } : {}),
          ...(rel.fromVersion ? { fromVersion: toGrcId(rel.fromVersion) } : {}),
          ...(rel.toSpace ? { toSpace: toGrcId(rel.toSpace) } : {}),
          ...(rel.toVersion ? { toVersion: toGrcId(rel.toVersion) } : {}),
          ...(rel.entity ? { entity: toGrcId(rel.entity) } : {}),
          ...(rel.position ? { position: rel.position } : {}),
        });
        break;
      }
      case 'DELETE_RELATION': {
        grcOps.push({
          type: 'deleteRelation',
          id: toGrcId(op.id),
        });
        break;
      }
      case 'UPDATE_RELATION': {
        const rel = op.relation;
        // Note: 'verified' field is not supported by GRC-20 v2 UpdateRelation type
        if (rel.verified !== undefined) {
          console.warn("Warning: 'verified' field is not supported by GRC-20 v2 format and will be ignored");
        }
        grcOps.push({
          type: 'updateRelation',
          id: toGrcId(rel.id),
          ...(rel.fromSpace ? { fromSpace: toGrcId(rel.fromSpace) } : {}),
          ...(rel.fromVersion ? { fromVersion: toGrcId(rel.fromVersion) } : {}),
          ...(rel.toSpace ? { toSpace: toGrcId(rel.toSpace) } : {}),
          ...(rel.toVersion ? { toVersion: toGrcId(rel.toVersion) } : {}),
          ...(rel.position ? { position: rel.position } : {}),
          unset: [],
        });
        break;
      }
      case 'CREATE_PROPERTY': {
        // Properties are not separate ops in GRC-20 v2 - they're part of the dictionary
        // Skip this op type as properties are handled implicitly
        break;
      }
      case 'UNSET_ENTITY_VALUES': {
        const unset = op.unsetEntityValues;
        grcOps.push({
          type: 'updateEntity',
          id: toGrcId(unset.id),
          set: [],
          unset: unset.properties.map(propId => ({
            property: toGrcId(propId),
            language: { type: 'all' as const },
          })),
        });
        break;
      }
      case 'UNSET_RELATION_FIELDS': {
        const unset = op.unsetRelationFields;
        const unsetFields: UnsetRelationField[] = [];
        if (unset.fromSpace) unsetFields.push('fromSpace');
        if (unset.fromVersion) unsetFields.push('fromVersion');
        if (unset.toSpace) unsetFields.push('toSpace');
        if (unset.toVersion) unsetFields.push('toVersion');
        if (unset.position) unsetFields.push('position');
        // Note: 'verified' is not supported by the GRC-20 v2 UnsetRelationField type
        if (unset.verified) {
          throw new Error("Unsetting 'verified' field is not supported by GRC-20 v2 format");
        }

        grcOps.push({
          type: 'updateRelation',
          id: toGrcId(unset.id),
          unset: unsetFields,
        });
        break;
      }
      default: {
        // Type assertion to get the type for error message
        const exhaustiveCheck: never = op;
        throw new Error(`Unknown op type: ${(exhaustiveCheck as Op).type}`);
      }
    }
  }

  return grcOps;
}

type PublishEditProposalParams = {
  name: string;
  ops: Op[];
  author: `0x${string}`;
  network?: Network;
};

type PublishEditResult = {
  // IPFS CID representing the edit prefixed with `ipfs://`
  cid: string;
  // The ID of the edit
  editId: Id;
};

/**
 * Generates correct GRC-20 v2 binary encoding for an Edit and uploads it to IPFS.
 *
 * @example
 * ```ts
 * import { IPFS } from '@graphprotocol/grc-20';
 *
 * const { cid, editId } = await IPFS.publishEdit({
 *   name: 'Edit name',
 *   ops: ops,
 *   author: '0x000000000000000000000000000000000000',
 * });
 * ```
 *
 * @param args arguments for publishing an edit to IPFS {@link PublishEditProposalParams}
 * @returns - {@link PublishEditResult}
 */
export async function publishEdit(args: PublishEditProposalParams): Promise<PublishEditResult> {
  const { name, ops, author, network = 'MAINNET' } = args;

  // Generate a new edit ID
  const editId = randomId();

  // Build the GRC-20 v2 Edit structure
  const grcEdit: GrcEdit = {
    id: editId,
    name,
    authors: [hexToGrcId(author)],
    createdAt: BigInt(Date.now()) * 1000n, // Convert to microseconds
    ops: convertOps(ops),
  };

  // Encode to binary format
  const binary = encodeEdit(grcEdit);

  // Create a copy to ensure we have a regular ArrayBuffer for Blob compatibility
  const binaryArray = new Uint8Array(binary);
  const blob = new Blob([binaryArray], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob);

  const cid = await Micro.runPromise(uploadBinary(formData, network));

  // Convert the GrcId back to a grc-20-ts Id string
  const editIdString = fromBytes(editId);

  return { cid, editId: editIdString };
}

type PublishImageParams =
  | {
      blob: Blob;
    }
  | {
      url: string;
    };

export async function uploadImage(params: PublishImageParams, network?: Network, alternativeGateway?: boolean) {
  const formData = new FormData();
  let blob: Blob;
  if ('blob' in params) {
    blob = params.blob;
  } else {
    // fetch the image and upload it to IPFS
    const response = await fetch(params.url);
    blob = await response.blob();
  }

  formData.append('file', blob);

  const buffer = new Uint8Array(await blob.arrayBuffer());
  let dimensions: { width: number; height: number } | undefined;
  try {
    dimensions = imageSize(buffer);
  } catch (_error) {}

  const cid = await Micro.runPromise(uploadFile(formData, network, alternativeGateway));

  if (dimensions) {
    return {
      cid,
      dimensions: {
        width: dimensions.width,
        height: dimensions.height,
      },
    };
  }

  return {
    cid,
  };
}

/**
 * Uploads a CSV file to IPFS and returns the CID. This CSV
 * file will be compressed using gzip before being uploaded.
 *
 * @example
 * ```ts
 * const file = Bun.file('cities.csv');
 * const fileText = await file.text();
 *
 * const cid = await Ipfs.uploadCSV(fileText);
 * ```
 *
 * @example
 * ```ts
 * import { Csv } from '@graphprotocol/grc-20';
 *
 * const csvString = Csv.stringify({
 *   data: Array.from({ length: 151_000 }, (_, i: number) => [i.toString(), (i * 2).toString(), (i * 3).toString()]),
 *   metadata: {
 *     filetype: 'CSV',
 *     columns: [
 *       {
 *         id: 'foo',
 *         type: 'TEXT',
 *       },
 *       {
 *         id: 'bar',
 *         type: 'NUMBER',
 *       },
 *       {
 *         id: 'baz',
 *         type: 'TEXT',
 *       },
 *     ],
 *   },
 * })
 *
 * const cid = await Ipfs.uploadCSV(csvString);
 * ```
 *
 * @param csvString The CSV to upload as a string
 * @returns IPFS CID representing the uploaded file prefixed with `ipfs://`
 */
export async function uploadCSV(csvString: string, network?: Network): Promise<`ipfs://${string}`> {
  const encoder = new TextEncoder();
  const csvStringBytes = encoder.encode(csvString);
  const blob = await gzipSync(csvStringBytes);

  const formData = new FormData();
  // @ts-expect-error - this is a type missmatch which is fine
  formData.append('file', new Blob([blob], { type: 'text/csv' }));

  return await Micro.runPromise(uploadBinary(formData, network));
}

function uploadBinary(formData: FormData, network?: Network) {
  return Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        fetch(`${getApiOrigin(network)}/ipfs/upload-edit`, {
          method: 'POST',
          body: formData,
        }),
      catch: error => new IpfsUploadError(`Could not upload data to IPFS: ${error}`),
    });

    const maybeCid = yield* Micro.tryPromise({
      try: async () => {
        const { cid } = await result.json();
        return cid;
      },
      catch: error => new IpfsUploadError(`Could not parse response from IPFS: ${error}`),
    });

    return maybeCid as `ipfs://${string}`;
  });
}

function uploadFile(formData: FormData, network?: Network, alternativeGateway?: boolean) {
  return Micro.gen(function* () {
    let apiUrl = `${getApiOrigin(network)}/ipfs/upload-file`;
    if (alternativeGateway) {
      apiUrl = `${getApiOrigin('TESTNET')}/ipfs/upload-file-alternative-gateway`;
    }

    const result = yield* Micro.tryPromise({
      try: () =>
        fetch(apiUrl, {
          method: 'POST',
          body: formData,
        }),
      catch: error => {
        return new IpfsUploadError(`Could not upload file to IPFS: ${error}`);
      },
    });

    const maybeCid = yield* Micro.tryPromise({
      try: async () => {
        const { cid } = await result.json();
        return cid;
      },
      catch: error => new IpfsUploadError(`Could not parse response from IPFS: ${error}`),
    });

    return maybeCid as `ipfs://${string}`;
  });
}
