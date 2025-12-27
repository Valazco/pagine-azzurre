import { createPublicClient, webSocket, http } from 'viem';
import { goerli, sepolia, mainnet } from 'viem/chains';
import type { Chain } from 'viem';

// Contract addresses by chain ID
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  5: '0xc2C3CC7Eb9647E82e134F3a6f73120e1bDFA38c0', // Goerli
  // Add sepolia/mainnet when deploying
};

// Valazco Token ABI - only balanceOf needed
export const VALAZCO_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'tokenOwner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Default chain configuration
export const CHAIN_ID = 5; // Goerli
export const INFURA_WS_URL =
  process.env.INFURA_WS_URL ||
  'wss://goerli.infura.io/ws/v3/ea90d8f923e5484c84e7518e9f58f16b';

// Server-side public client (singleton)
let publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: goerli,
      transport: webSocket(INFURA_WS_URL),
    });
  }
  return publicClient;
}

// Supported chains for wagmi (client-side)
export const supportedChains: readonly [Chain, ...Chain[]] = [
  goerli,
  sepolia,
  mainnet,
];

// Export chain objects for convenience
export { goerli, sepolia, mainnet };
