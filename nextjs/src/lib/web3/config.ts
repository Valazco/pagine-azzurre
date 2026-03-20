import { createPublicClient, http } from 'viem';
import { goerli, sepolia, mainnet, localhost } from 'viem/chains';
import type { Chain } from 'viem';

// Local Anvil chain configuration
const anvil: Chain = {
  ...localhost,
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
};

// Default chain configuration (from env or default to local)
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

// Contract addresses by chain ID
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  31337: (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`, // Local Anvil
  5: '0xc2C3CC7Eb9647E82e134F3a6f73120e1bDFA38c0', // Goerli (deprecated)
  11155111: '0x0000000000000000000000000000000000000000', // Sepolia (to be deployed)
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

// Get chain object by ID
function getChainById(chainId: number): Chain {
  switch (chainId) {
    case 31337: return anvil;
    case 5: return goerli;
    case 11155111: return sepolia;
    case 1: return mainnet;
    default: return anvil;
  }
}

// Server-side public client (singleton)
let publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: getChainById(CHAIN_ID),
      transport: http(RPC_URL),
    });
  }
  return publicClient;
}

// Supported chains for wagmi (client-side)
export const supportedChains: readonly [Chain, ...Chain[]] = [
  anvil,
  sepolia,
  mainnet,
];

// Export chain objects for convenience
export { anvil, goerli, sepolia, mainnet };
