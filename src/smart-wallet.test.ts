import { toSafeSmartAccount } from 'permissionless/accounts';
import { createPublicClient, http } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { privateKeyToAccount } from 'viem/accounts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSmartAccountWalletClient } from './smart-wallet.js';

// mock all external dependencies
vi.mock('permissionless', () => ({
  createSmartAccountClient: vi.fn().mockReturnValue({ mockSmartAccountClient: true }),
}));

vi.mock('permissionless/accounts', () => ({
  toSafeSmartAccount: vi.fn().mockResolvedValue({ mockSafeAccount: true }),
}));

vi.mock('permissionless/clients/pimlico', () => ({
  createPimlicoClient: vi.fn().mockReturnValue({
    mockPimlicoClient: true,
    getUserOperationGasPrice: vi.fn().mockResolvedValue({
      fast: { maxFeePerGas: 1000000000n, maxPriorityFeePerGas: 100000000n },
    }),
  }),
}));

vi.mock('viem', () => ({
  createPublicClient: vi.fn().mockReturnValue({ mockPublicClient: true }),
  http: vi.fn().mockImplementation(url => ({ mockTransport: true, url })),
}));

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn().mockReturnValue({ mockAccount: true }),
}));

describe('getSmartAccountWalletClient', () => {
  const mockPrivateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a client with the default RPC URL when no RPC URL is provided', async () => {
    await getSmartAccountWalletClient({ privateKey: mockPrivateKey });

    expect(http).toHaveBeenCalledWith('https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz');
    expect(createPublicClient).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: { mockTransport: true, url: 'https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz' },
      }),
    );
  });

  it('should create a client with a custom RPC URL when provided', async () => {
    const customRpcUrl = 'https://custom-rpc.example.com';
    await getSmartAccountWalletClient({
      privateKey: mockPrivateKey,
      rpcUrl: customRpcUrl,
    });

    expect(http).toHaveBeenCalledWith(customRpcUrl);
    expect(createPublicClient).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: { mockTransport: true, url: customRpcUrl },
      }),
    );
  });

  it('should initialize safe account with correct parameters', async () => {
    await getSmartAccountWalletClient({ privateKey: mockPrivateKey });

    expect(privateKeyToAccount).toHaveBeenCalledWith(mockPrivateKey);
    expect(toSafeSmartAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        client: { mockPublicClient: true },
        owners: [{ mockAccount: true }],
        entryPoint: {
          address: entryPoint07Address,
          version: '0.7',
        },
        version: '1.4.1',
      }),
    );
  });
});
