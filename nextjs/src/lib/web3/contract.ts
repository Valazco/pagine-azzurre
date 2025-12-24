import { ethers } from 'ethers';

// Valazco Token Contract ABI (simplified - only functions we need)
const VALAZCO_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'tokenOwner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true
  }
];

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, string> = {
  3: '0xc43b91aaaD25EAAeEDBF85ffFF404E19778a71Cd', // Ropsten (deprecated)
  5: '0xc2C3CC7Eb9647E82e134F3a6f73120e1bDFA38c0'  // Goerli
};

const NETWORK_ID = 5; // Goerli
const INFURA_URL = 'wss://goerli.infura.io/ws/v3/ea90d8f923e5484c84e7518e9f58f16b';

let provider: ethers.WebSocketProvider | null = null;
let contract: ethers.Contract | null = null;

function getProvider(): ethers.WebSocketProvider {
  if (!provider) {
    provider = new ethers.WebSocketProvider(INFURA_URL);
  }
  return provider;
}

function getContract(): ethers.Contract {
  if (!contract) {
    const address = CONTRACT_ADDRESSES[NETWORK_ID];
    if (!address) {
      throw new Error(`No contract address for network ${NETWORK_ID}`);
    }
    contract = new ethers.Contract(address, VALAZCO_ABI, getProvider());
  }
  return contract;
}

export async function getValazcoBalance(account: string): Promise<number> {
  try {
    if (!account || account === '') {
      return 0;
    }
    const valazcoContract = getContract();
    const balance = await valazcoContract.balanceOf(account);
    // Balance is stored with 2 decimals
    return parseFloat(balance.toString()) / 100;
  } catch (error) {
    console.error('Error getting Valazco balance:', error);
    return 0;
  }
}

export { NETWORK_ID, CONTRACT_ADDRESSES };
