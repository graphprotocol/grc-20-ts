import { DEFAULT_API_HOST } from './constants.js';

type Params = {
  editorAddress: string;
  name: string;
  network?: 'TESTNET' | 'MAINNET';
};

/**
 * Creates a space with the given name and editor address.
 */
export const createSpace = async (params: Params) => {
  const apiHost = DEFAULT_API_HOST;
  const result = await fetch(`${apiHost}/deploy`, {
    method: 'POST',
    body: JSON.stringify({
      spaceName: params.name,
      initialEditorAddress: params.editorAddress,
      network: params.network ?? 'MAINNET',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { spaceId } = await result.json();
  return { id: spaceId };
};
