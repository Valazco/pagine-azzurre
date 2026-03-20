import { http, createConfig } from 'wagmi';
import { sepolia, mainnet, localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import type { Chain } from 'wagmi/chains';

// Local Anvil chain for development
const anvil: Chain = {
  ...localhost,
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
};

export const wagmiConfig = createConfig({
  chains: [anvil, sepolia, mainnet],
  connectors: [
    injected(), // MetaMask and other injected wallets
  ],
  transports: {
    [anvil.id]: http('http://localhost:8545'),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

// Re-export chains for convenience
export { anvil, sepolia, mainnet };
