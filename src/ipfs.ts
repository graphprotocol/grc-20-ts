/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */

import { Micro } from 'effect';

import { EditProposal } from '~/proto.js';
import type { Op } from './types.js';

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

  // @TODO: This isn't the correct endpoint.
  const result = await fetch('https://api.geobrowser.io/ipfs/upload-edit', {
    method: 'POST',
    body: formData,
  });

  const { cid } = await result.json();
  return cid;
}
