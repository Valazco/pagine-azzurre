'use client';

import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, VALAZCO_ABI, CHAIN_ID } from '@/lib/web3/config';

export function useValazcoBalance(address: `0x${string}` | undefined) {
  const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: VALAZCO_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress,
    },
  });

  // Balance stored with 2 decimals
  const balance = data ? Number(data) / 100 : 0;

  return {
    balance,
    isLoading,
    error,
    refetch,
  };
}
