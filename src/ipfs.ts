/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';
import { gzipSync } from 'fflate';
import { imageSize } from 'image-size';

import { Edit, EditProposal } from '../proto.js';
import { Id } from './id.js';
import type { Op } from './types.js';

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
}

type PublishEditProposalParams = {
  name: string;
  ops: Op[];
  author: string;
};

type PublishEditResult = {
  // IPFS CID representing the edit prefixed with `ipfs://`
  cid: string;
  // The ID of the edit
  editId: Id;
};

/**
 * Generates correct protobuf encoding for an Edit and uploads it to IPFS.
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
  const { name, ops, author } = args;

  const edit = EditProposal.encode({ name, ops, author });

  const blob = new Blob([edit], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob);

  const cid = await Micro.runPromise(uploadBinary(formData));
  const result = Edit.fromBinary(edit);

  return { cid, editId: Id(result.id) };
}

type PublishImageParams =
  | {
      blob: Blob;
    }
  | {
      url: string;
    };

export async function uploadImage(params: PublishImageParams) {
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

  const buffer = Buffer.from(await blob.arrayBuffer());
  let dimensions: { width: number; height: number } | undefined;
  try {
    dimensions = imageSize(buffer);
  } catch (error) {}

  const cid = await Micro.runPromise(uploadFile(formData));

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
export async function uploadCSV(csvString: string): Promise<`ipfs://${string}`> {
  const encoder = new TextEncoder();
  const csvStringBytes = encoder.encode(csvString);
  const blob = await gzipSync(csvStringBytes);

  const formData = new FormData();
  formData.append('file', new Blob([blob], { type: 'text/csv' }));

  return await Micro.runPromise(uploadBinary(formData));
}

function uploadBinary(formData: FormData) {
  return Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        fetch('https://api-testnet.grc-20.thegraph.com/ipfs/upload-edit', {
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

function uploadFile(formData: FormData) {
  return Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        fetch('https://api-testnet.grc-20.thegraph.com/ipfs/upload-file', {
          method: 'POST',
          body: formData,
        }),
      catch: error => new IpfsUploadError(`Could not upload file to IPFS: ${error}`),
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
