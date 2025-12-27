import { http, createConfig } from 'wagmi';
import { goerli, sepolia, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [goerli, sepolia, mainnet],
  connectors: [
    injected(), // MetaMask and other injected wallets
  ],
  transports: {
    [goerli.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

// Re-export chains for convenience
export { goerli, sepolia, mainnet };
