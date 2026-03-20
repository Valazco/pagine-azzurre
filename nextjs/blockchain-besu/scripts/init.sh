#!/bin/bash
# Initialize Besu blockchain and deploy contract

set -e

RPC_URL="${RPC_URL:-http://localhost:8545}"
MAX_RETRIES=30
RETRY_INTERVAL=2

echo "=== Pagine Azzurre Blockchain Initialization ==="

# Wait for Besu to be ready
echo "Waiting for Besu to be ready..."
for i in $(seq 1 $MAX_RETRIES); do
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        "$RPC_URL" > /dev/null 2>&1; then
        echo "Besu is ready!"
        break
    fi

    if [ $i -eq $MAX_RETRIES ]; then
        echo "Error: Besu did not become ready in time"
        exit 1
    fi

    echo "  Attempt $i/$MAX_RETRIES - waiting..."
    sleep $RETRY_INTERVAL
done

# Get current block number
BLOCK_NUMBER=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    "$RPC_URL" | jq -r '.result')
echo "Current block number: $BLOCK_NUMBER"

# Check if contract is already deployed
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACT_FILE="$SCRIPT_DIR/../contract-address.txt"

if [ -f "$CONTRACT_FILE" ]; then
    CONTRACT_ADDRESS=$(cat "$CONTRACT_FILE")
    echo "Found existing contract address: $CONTRACT_ADDRESS"

    # Verify contract exists
    CODE=$(curl -s -X POST -H "Content-Type: application/json" \
        --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$CONTRACT_ADDRESS\", \"latest\"],\"id\":1}" \
        "$RPC_URL" | jq -r '.result')

    if [ "$CODE" != "0x" ] && [ -n "$CODE" ]; then
        echo "Contract is already deployed and valid"
        echo ""
        echo "=== Blockchain Ready ==="
        echo "RPC URL: $RPC_URL"
        echo "Contract Address: $CONTRACT_ADDRESS"
        exit 0
    else
        echo "Contract address exists but no code found, redeploying..."
    fi
fi

# Deploy contract
echo ""
echo "Deploying ValazcoToken contract..."
bash "$SCRIPT_DIR/deploy-contract.sh"

echo ""
echo "=== Initialization Complete ==="
