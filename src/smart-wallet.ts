import { type SmartAccountClient, createSmartAccountClient } from 'permissionless';
import { type SafeSmartAccountImplementation, toSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import type { Address, Chain, Hex, HttpTransport } from 'viem';
import { http, createPublicClient } from 'viem';
import { type SmartAccountImplementation, entryPoint07Address } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';

const DEFAULT_RPC_URL = 'https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz';

/**
 * We provide a fallback API key for gas sponsorship for the duration of the
 * Geo Genesis early access period. This API key is gas-limited.
 */
const DEFAULT_API_KEY = 'pim_KqHm63txxhbCYjdDaWaHqH';

type GetSmartAccountWalletClientParams = {
  privateKey: Hex;
  rpcUrl?: string;
};

type SafeSmartAccount = SafeSmartAccountImplementation<'0.7'> & {
  address: Address;
  getNonce: NonNullable<SmartAccountImplementation['getNonce']>;
  isDeployed: () => Promise<boolean>;
  type: 'smart';
};

type GeoSmartAccount = SmartAccountClient<
  HttpTransport<undefined, false>,
  Chain,
  object &
    SafeSmartAccount & {
      address: Address;
      getNonce: NonNullable<SmartAccountImplementation['getNonce']>;
      isDeployed: () => Promise<boolean>;
      type: 'smart';
    },
  undefined,
  undefined
>;

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
  rpcUrl = DEFAULT_RPC_URL,
}: GetSmartAccountWalletClientParams): Promise<GeoSmartAccount> => {
  const GEOGENESIS: Chain = {
    id: Number('80451'),
    name: 'Geo Genesis',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      },
    },
  };

  const transport = http(rpcUrl);

  const publicClient = createPublicClient({
    transport,
    chain: GEOGENESIS,
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
    chain: GEOGENESIS,
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  });

  const smartAccount = createSmartAccountClient({
    chain: GEOGENESIS,
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
