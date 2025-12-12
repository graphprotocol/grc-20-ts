import { createSmartAccountClient, type SmartAccountClient } from 'permissionless';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import type { Chain, Hex, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, http } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';
import type { GeoSmartAccount } from './types.js';

const MAINNET_DEFAULT_RPC_URL = 'https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz';
const TESTNET_DEFAULT_RPC_URL = 'https://rpc-geo-test-zc16z3tcvf.t.conduit.xyz';

/**
 * We provide a fallback API key for gas sponsorship for the duration of the
 * Geo Genesis early access period. This API key is gas-limited.
 */
const DEFAULT_API_KEY = 'pim_KqHm63txxhbCYjdDaWaHqH';

type GetSmartAccountWalletClientParams = {
  privateKey: Hex;
  rpcUrl?: string;
};

const createChain = (network: 'TESTNET' | 'MAINNET', rpcUrl: string) => {
  const chain: Chain = {
    id: network === 'TESTNET' ? Number('19411') : Number('80451'),
    name: 'Geo Genesis',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [rpcUrl ?? (network === 'TESTNET' ? TESTNET_DEFAULT_RPC_URL : MAINNET_DEFAULT_RPC_URL)],
      },
      public: {
        http: [rpcUrl ?? (network === 'TESTNET' ? TESTNET_DEFAULT_RPC_URL : MAINNET_DEFAULT_RPC_URL)],
      },
    },
  };
  return chain;
};

// type GeoSmartAccountWalletClient = Promise<ReturnType<typeof createSmartAccountClient>>;

/**
 * Get a smart account wallet client for your Geo account.
 *
 * IMPORTANT: Be careful with your private key. Don't commit it to version control.
 * You can get your private key using https://www.geobrowser.io/export-wallet
 *
 * @example
 * ```ts
 * const smartAccountWalletClient = await getSmartAccountWalletClient({
 *   privateKey: '0x...',
 *   rpcUrl: '...', // optional
 * });
 * ```
 * @param params – {@link GetSmartAccountWalletClientParams}
 * @returns – {@link SmartAccountClient}
 */
export const getSmartAccountWalletClient = async ({
  privateKey,
  rpcUrl = MAINNET_DEFAULT_RPC_URL,
}: GetSmartAccountWalletClientParams): Promise<GeoSmartAccount> => {
  const chain = createChain('MAINNET', rpcUrl);
  const transport = http(rpcUrl);

  const publicClient = createPublicClient({
    transport,
    chain,
  });

  const safeAccount = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey)],
    entryPoint: {
      // optional, defaults to 0.7
      address: entryPoint07Address,
      version: '0.7',
    },
    version: '1.4.1',
  });

  const bundlerTransport = http(`https://api.pimlico.io/v2/80451/rpc?apikey=${DEFAULT_API_KEY}`);
  const paymasterClient = createPimlicoClient({
    transport: bundlerTransport,
    chain,
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  });

  const smartAccount = createSmartAccountClient({
    chain,
    account: safeAccount,
    paymaster: paymasterClient,
    bundlerTransport,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await paymasterClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  return smartAccount;
};

export const getWalletClient = async ({
  privateKey,
  rpcUrl = TESTNET_DEFAULT_RPC_URL,
}: GetSmartAccountWalletClientParams): Promise<WalletClient> => {
  const chain = createChain('TESTNET', rpcUrl);
  const transport = http(rpcUrl);
  const wallet = createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain,
    transport,
  });
  return wallet;
};
