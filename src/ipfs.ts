/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';

import { EditProposal } from '../proto.js';
import type { Op } from './types.js';

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
}

type PublishEditProposalArgs = {
  name: string;
  ops: Op[];
  author: string;
  baseUrl: string;
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
 *   baseUrl: 'https://api.geobrowser.io',
 * });
 * ```
 *
 * @param args arguments for publishing an edit to IPFS {@link PublishEditProposalArgs}
 * @returns IPFS CID representing the edit prefixed with `ipfs://`
 */
export async function publishEdit(args: PublishEditProposalArgs): Promise<string> {
  const { name, ops, author } = args;

  const edit = EditProposal.make({ name, ops, author });

  const blob = new Blob([edit], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob);

  const upload = Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        // @TODO: This isn't the correct endpoint. For now we'll let callers
        // specify the baseUrl of our API. Eventually this will get hardcoded
        // to the default API.
        fetch(`${args.baseUrl}/ipfs/upload-edit`, {
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

  return await Micro.runPromise(upload);
}
