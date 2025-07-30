import type { Op } from '../types.js';
import { MAINNET_API_ORIGIN, TESTNET_API_ORIGIN } from './constants.js';

type Params = {
  editorAddress: string;
  name: string;
  network?: 'TESTNET' | 'MAINNET';
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
 */
export const createSpace = async (params: Params) => {
  const governanceType = params.governanceType ?? 'PERSONAL';
  const apiHost = params.network === 'TESTNET' ? TESTNET_API_ORIGIN : MAINNET_API_ORIGIN;
  console.log('apiHost', apiHost);

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
  return { id: jsonResult.spaceId };
};
