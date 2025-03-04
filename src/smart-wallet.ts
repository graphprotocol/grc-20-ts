import { createSmartAccountClient } from 'permissionless';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import type { Chain, Hex } from 'viem';
import { createPublicClient, http } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';

const DEFAULT_RPC_URL = 'https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz';

type GetSmartAccountWalletClientParams = {
  privateKey: Hex;
  pimlicoApiKey: string;
  rpcUrl?: string;
};

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
 *   pimlicoApiKey: '...',
 *   rpcUrl: '...', // optional
 * });
 * ```
 * @param params – {@link GetSmartAccountWalletClientParams}
 * @returns – {@link SmartAccountClient}
 */
export const getSmartAccountWalletClient = async ({
  privateKey,
  pimlicoApiKey,
  rpcUrl: rpcUrlInput,
  // biome-ignore lint/suspicious/noExplicitAny: we want to return the SmartAccountClient type, which is currently broken
}: GetSmartAccountWalletClientParams): Promise<any> => {
  const rpcUrl = rpcUrlInput ?? DEFAULT_RPC_URL;

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

  const bundlerTransport = http(`https://api.pimlico.io/v2/80451/rpc?apikey=${pimlicoApiKey}`);
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
