/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';

import { EditProposal } from '~/proto.js';
import type { Op } from './types.js';

class CidValidateError extends Error {
  readonly _tag = 'CidValidateError';
}

function validateCid(cid: string) {
  return Micro.gen(function* () {
    const [, cidContains] = cid.split('ipfs://');
    if (!cid.startsWith('ipfs://')) {
      yield* Micro.fail(new CidValidateError(`CID ${cid} does not start with ipfs://`));
    }

    if (cidContains === undefined || cidContains === '') {
      yield* Micro.fail(new CidValidateError(`CID ${cid} is not valid`));
    }

    return true;
  });
}

class IpfsUploadError extends Error {
  readonly _tag = 'IpfsUploadError';
}

type PublishEditProposalArgs = {
  name: string;
  ops: Op[];
  author: string;
  baseUrl: string;
};

export async function publishEdit(args: PublishEditProposalArgs): Promise<string> {
  const { name, ops, author } = args;

  const edit = EditProposal.make({ name, ops, author });

  // Upload binary via Geo API
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

    yield* validateCid(maybeCid);

    return maybeCid as `ipfs://${string}`;
  });

  return await Micro.runPromise(
    Micro.retry(upload, {
      times: 3,
    }),
  );
}
