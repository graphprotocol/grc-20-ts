import type { Op } from '@geoprotocol/grc-20';
import { IdUtils } from '../../index.js';
import { Id } from '../id.js';
import { getApiOrigin, type Network } from './constants.js';

type CreateSpaceParams = {
  editorAddress: string;
  name: string;
  network?: Network;
  ops?: Op[];
  spaceEntityId?: string;

  /**
   * Select which contracts to deploy based on the governance type.
   * If no governance type is provided it defaults to PERSONAL
   */
  governanceType?: 'PUBLIC' | 'PERSONAL';
};

type BaseDeployParams = {
  spaceName: string;
  ops?: Op[];
  spaceEntityId?: string;
};

type DeployParams = BaseDeployParams &
  (
    | {
        initialEditorAddresses: string[];
      }
    | {
        initialEditorAddress: string;
      }
  );

/**
 * Creates a space with the given name and editor address.
 *
 * @example
 * ```ts
 * const { id } = await createSpace({
 *   editorAddress: '0x1234567890123456789012345678901234567890',
 *   name: 'My Space',
 *   network: 'TESTNET', // optional, defaults to 'MAINNET'
 *   spaceEntityId: '1234567890123456789012345678901234567890', // optional
 *   governanceType: 'PUBLIC', // optional, defaults to 'PERSONAL'
 *   ops: [], // optional
 * });
 * ```
 * @param params – {@link CreateSpaceParams}
 * @returns – {@link Id}
 */
export const createSpace = async (params: CreateSpaceParams) => {
  const governanceType = params.governanceType ?? 'PERSONAL';
  const apiHost = getApiOrigin(params.network);

  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('editorAddress', params.editorAddress);
  if (params.spaceEntityId) {
    formData.append('spaceEntityId', params.spaceEntityId);
  }

  if (params.ops) {
    formData.append('ops', JSON.stringify(params.ops));
  }

  let url = `${apiHost}/deploy`;

  const deployParams: DeployParams =
    governanceType === 'PERSONAL'
      ? {
          spaceName: params.name,
          ops: params.ops,
          spaceEntityId: params.spaceEntityId,
          initialEditorAddress: params.editorAddress,
        }
      : {
          spaceName: params.name,
          ops: params.ops,
          spaceEntityId: params.spaceEntityId,
          initialEditorAddresses: [params.editorAddress],
        };

  if (governanceType === 'PERSONAL') {
    url = `${url}/personal`;
  }

  if (governanceType === 'PUBLIC') {
    url = `${url}/public`;
  }

  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(deployParams),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const jsonResult = await result.json();
  if (!jsonResult || !jsonResult.spaceId || !IdUtils.isValid(jsonResult.spaceId)) {
    throw new Error(`Failed to create space: ${JSON.stringify(jsonResult)}`);
  }
  return { id: Id(jsonResult.spaceId) };
};
