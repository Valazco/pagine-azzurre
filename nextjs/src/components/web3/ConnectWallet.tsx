'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import styled from 'styled-components';

const Button = styled.button<{ $connected?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ $connected }) => ($connected ? '#dc2626' : '#003366')};
  background-color: ${({ $connected }) => ($connected ? 'white' : '#003366')};
  color: ${({ $connected }) => ($connected ? '#dc2626' : 'white')};

  &:hover {
    background-color: ${({ $connected }) => ($connected ? '#fee2e2' : '#002244')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Address = styled.span`
  font-family: monospace;
  font-size: 0.875rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

interface ConnectWalletProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function ConnectWallet({ onConnect, onDisconnect }: ConnectWalletProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected');
    if (injectedConnector) {
      connect(
        { connector: injectedConnector },
        {
          onSuccess: (data) => {
            if (onConnect && data.accounts[0]) {
              onConnect(data.accounts[0]);
            }
          },
        }
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  if (isConnected && address) {
    return (
      <WalletInfo>
        <Address>
          {address.slice(0, 6)}...{address.slice(-4)}
        </Address>
        <Button $connected onClick={handleDisconnect}>
          Disconnetti
        </Button>
      </WalletInfo>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting || isPending}>
      {isConnecting || isPending ? 'Connessione...' : 'Connetti MetaMask'}
    </Button>
  );
}
