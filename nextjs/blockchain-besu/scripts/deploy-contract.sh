#!/bin/bash
# Deploy ValazcoToken contract to Besu

set -e

RPC_URL="${RPC_URL:-http://localhost:8545}"
PRIVATE_KEY="${PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
INITIAL_SUPPLY="${INITIAL_SUPPLY:-100000000}"  # 1,000,000 VLZ with 2 decimals

echo "=== Deploying ValazcoToken to Besu ==="
echo "RPC URL: $RPC_URL"

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "Error: Foundry (forge) is not installed"
    echo "Install with: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi

# Navigate to contracts directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../contracts"

echo "Compiling contract..."
forge build --contracts . --out ./out

echo "Deploying contract..."
DEPLOY_OUTPUT=$(forge create \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --json \
    ValazcoToken.sol:ValazcoToken \
    --constructor-args "$INITIAL_SUPPLY")

CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | jq -r '.deployedTo')
TX_HASH=$(echo "$DEPLOY_OUTPUT" | jq -r '.transactionHash')

echo ""
echo "=== Contract Deployed Successfully ==="
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Transaction Hash: $TX_HASH"
echo ""

# Save contract address to file
echo "$CONTRACT_ADDRESS" > "$SCRIPT_DIR/../contract-address.txt"
echo "Contract address saved to contract-address.txt"

# Verify deployment
echo ""
echo "Verifying deployment..."
BALANCE=$(cast call "$CONTRACT_ADDRESS" "balanceOf(address)(uint256)" "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" --rpc-url "$RPC_URL")
echo "Owner balance: $BALANCE (raw units)"

echo ""
echo "Done! Update your .env file with:"
echo "NEXT_PUBLIC_TOKEN_ADDRESS=$CONTRACT_ADDRESS"
