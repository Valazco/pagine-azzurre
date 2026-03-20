import {
  getPublicClient,
  CONTRACT_ADDRESSES,
  VALAZCO_ABI,
  CHAIN_ID,
} from './config';

export async function getValazcoBalance(account: string): Promise<number> {
  try {
    if (!account || account === '') {
      return 0;
    }

    const contractAddress = CONTRACT_ADDRESSES[CHAIN_ID];
    if (!contractAddress) {
      throw new Error(`No contract address for chain ${CHAIN_ID}`);
    }

    const client = getPublicClient();
    const balance = await client.readContract({
      address: contractAddress,
      abi: VALAZCO_ABI,
      functionName: 'balanceOf',
      args: [account as `0x${string}`],
    });

    // Balance stored with 2 decimals
    return Number(balance) / 100;
  } catch (error) {
    console.error('Error getting Valazco balance:', error);
    return 0;
  }
}

export { CHAIN_ID as NETWORK_ID, CONTRACT_ADDRESSES };
