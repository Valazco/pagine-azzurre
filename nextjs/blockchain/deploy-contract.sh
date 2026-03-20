#!/bin/bash
set -e

CONTRACT_FILE="/data/contract-address.txt"
RPC_URL="http://localhost:8545"

# Private key from the deterministic mnemonic (account 0)
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

echo "Compiling ValazcoToken contract..."
cd /app
forge build --contracts /app/ValazcoToken.sol --out /app/out

echo "Deploying ValazcoToken with initial supply of 100,000,000 (1M tokens with 2 decimals)..."

# Use forge create which outputs the address directly
RESULT=$(forge create --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    /app/ValazcoToken.sol:ValazcoToken \
    --constructor-args 100000000 \
    --json 2>/dev/null || true)

# Extract contract address using grep and sed (no jq needed)
if [ -n "$RESULT" ]; then
    CONTRACT_ADDRESS=$(echo "$RESULT" | grep -o '"deployedTo":"[^"]*"' | sed 's/"deployedTo":"//;s/"//')
fi

# Fallback: if forge create didn't work, use cast send
if [ -z "$CONTRACT_ADDRESS" ] || [ "$CONTRACT_ADDRESS" = "null" ]; then
    echo "Using cast send for deployment..."

    # Get bytecode
    BYTECODE=$(cat /app/out/ValazcoToken.sol/ValazcoToken.json | grep -o '"object":"0x[^"]*"' | head -1 | sed 's/"object":"//;s/"//')
    ARGS=$(cast abi-encode "constructor(uint256)" 100000000)

    RESULT=$(cast send --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        --create "${BYTECODE}${ARGS:2}" \
        --json)

    CONTRACT_ADDRESS=$(echo "$RESULT" | grep -o '"contractAddress":"[^"]*"' | sed 's/"contractAddress":"//;s/"//')
fi

if [ -n "$CONTRACT_ADDRESS" ] && [ "$CONTRACT_ADDRESS" != "null" ]; then
    echo "Contract deployed at: $CONTRACT_ADDRESS"
    echo "$CONTRACT_ADDRESS" > $CONTRACT_FILE
    echo "Deployment complete!"
else
    echo "ERROR: Failed to deploy contract"
    exit 1
fi
