/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';
import { gzipSync } from 'fflate';
import { imageSize } from 'image-size';

import { encodeEdit, type EncodeOptions, type Edit as GrcEdit, randomId, formatId } from '@geoprotocol/grc-20';
import { getApiOrigin, type Network } from './graph/constants.js';
import type { Id } from './id.js';
import { fromBytes } from './id-utils.js';
import type { Op } from './types.js';
import { convertOps, hexToGrcId } from './codec/convert.js';

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
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
