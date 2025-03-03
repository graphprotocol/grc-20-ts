/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';
import { gzipSync, zipSync } from 'fflate';
import { imageSize } from 'image-size';

import { EditProposal } from '../proto.js';
import type { Op } from './types.js';

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
}

type PublishEditProposalParams = {
  name: string;
  ops: Op[];
  author: string;
};

/**
 * Generates correct protobuf encoding for an Edit and uploads it to IPFS.
 *
 * @example
 * ```ts
 * import { IPFS } from '@graphprotocol/grc-20';
 *
 * const cid = await IPFS.publishEdit({
 *   name: 'Edit name',
 *   ops: ops,
 *   author: '0x000000000000000000000000000000000000',
 * });
 * ```
 *
 * @param args arguments for publishing an edit to IPFS {@link PublishEditProposalParams}
 * @returns IPFS CID representing the edit prefixed with `ipfs://`
 */
export async function publishEdit(args: PublishEditProposalParams): Promise<string> {
  const { name, ops, author } = args;

  const edit = EditProposal.encode({ name, ops, author });

  const blob = new Blob([edit], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob);

  return await Micro.runPromise(upload(formData));
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

  return await Micro.runPromise(upload(formData));
}

export async function uploadCSV(csvString: string) {
  const encoder = new TextEncoder();
  const csvStringBytes = encoder.encode(csvString);
  const blob = await gzipSync(csvStringBytes);

  const formData = new FormData();
  formData.append('file', new Blob([blob], { type: 'text/csv' }));

  return await Micro.runPromise(upload(formData));
}

function upload(formData: FormData) {
  return Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        fetch('https://api-testnet.grc-20.thegraph.com/ipfs/upload-edit', {
          method: 'POST',
          body: formData,
        }),
      catch: error => new IpfsUploadError(`Could not upload edit to IPFS: ${error}`),
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
