export const MAINNET_API_ORIGIN = 'https://hypergraph-v2.up.railway.app';
export const TESTNET_API_ORIGIN = 'https://api-testnet.geobrowser.io';
export const TESTNET_V2_API_ORIGIN = 'https://testnet-api.geobrowser.io';

export type Network = 'TESTNET' | 'TESTNET_V2' | 'MAINNET';

export function getApiOrigin(network?: Network): string {
  if (network === 'TESTNET') {
    return TESTNET_API_ORIGIN;
  }
  if (network === 'TESTNET_V2') {
    return TESTNET_V2_API_ORIGIN;
  }
  return MAINNET_API_ORIGIN;
}
