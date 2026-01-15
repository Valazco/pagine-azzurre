import { createWalletClient, createPublicClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY as `0x${string}`;
const ADMIN_WALLET_ADDRESS = (process.env.ADMIN_WALLET_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266') as `0x${string}`;

// Valazco Token ABI
const VALAZCO_ABI = parseAbi([
  'function mint(address to, uint256 value) public',
  'function transfer(address to, uint256 value) public returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
]);

// Amount to mint on verification (100 tokens with 2 decimals = 10000)
const VERIFICATION_REWARD = 10000n;

/**
 * Mint Valazco tokens to a user's wallet
 * @param toAddress - The recipient's wallet address
 * @param amount - Amount to mint (default: 100 VLZ = 10000 with 2 decimals)
 */
export async function mintTokens(
  toAddress: `0x${string}`,
  amount: bigint = VERIFICATION_REWARD
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!ADMIN_PRIVATE_KEY) {
    console.error('ADMIN_PRIVATE_KEY not configured');
    return { success: false, error: 'Admin wallet not configured' };
  }

  try {
    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);

    const walletClient = createWalletClient({
      account,
      transport: http(RPC_URL),
    });

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: VALAZCO_ABI,
      functionName: 'mint',
      args: [toAddress, amount],
    });

    console.log(`Minted ${amount} tokens to ${toAddress}, tx: ${hash}`);

    return { success: true, txHash: hash };
  } catch (error) {
    console.error('Error minting tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(address: `0x${string}`): Promise<bigint> {
  try {
    const publicClient = createPublicClient({
      transport: http(RPC_URL),
    });

    const balance = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: VALAZCO_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0n;
  }
}

/**
 * Transfer tokens from a user to the escrow (admin) account
 * Used when buyer pays for an order
 * @param fromPrivateKey - The sender's private key
 * @param amount - Amount to transfer (with 2 decimals, so 1 VLZ = 100)
 */
export async function transferToEscrow(
  fromPrivateKey: `0x${string}`,
  amount: bigint
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const account = privateKeyToAccount(fromPrivateKey);

    const walletClient = createWalletClient({
      account,
      transport: http(RPC_URL),
    });

    // Check balance first
    const balance = await getTokenBalance(account.address);
    if (balance < amount) {
      return {
        success: false,
        error: `Insufficient balance. Has: ${balance}, needs: ${amount}`
      };
    }

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: VALAZCO_ABI,
      functionName: 'transfer',
      args: [ADMIN_WALLET_ADDRESS, amount],
    });

    console.log(`Transferred ${amount} tokens to escrow, tx: ${hash}`);

    return { success: true, txHash: hash };
  } catch (error) {
    console.error('Error transferring to escrow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Release tokens from escrow (admin) to the seller
 * Used when buyer confirms delivery
 * @param toAddress - The seller's wallet address
 * @param amount - Amount to release (with 2 decimals, so 1 VLZ = 100)
 */
export async function releaseFromEscrow(
  toAddress: `0x${string}`,
  amount: bigint
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!ADMIN_PRIVATE_KEY) {
    console.error('ADMIN_PRIVATE_KEY not configured');
    return { success: false, error: 'Admin wallet not configured' };
  }

  try {
    const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);

    const walletClient = createWalletClient({
      account,
      transport: http(RPC_URL),
    });

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: VALAZCO_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
    });

    console.log(`Released ${amount} tokens from escrow to ${toAddress}, tx: ${hash}`);

    return { success: true, txHash: hash };
  } catch (error) {
    console.error('Error releasing from escrow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export admin wallet address for reference
export { ADMIN_WALLET_ADDRESS };
