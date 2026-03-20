#!/bin/bash
set -e

STATE_FILE="/data/anvil-state.json"
CONTRACT_FILE="/data/contract-address.txt"

echo "Starting Anvil blockchain node..."

# Check if we have existing state
if [ -f "$STATE_FILE" ]; then
    echo "Loading existing state from $STATE_FILE"
    anvil \
        --host 0.0.0.0 \
        --port 8545 \
        --accounts 100 \
        --balance 10000 \
        --mnemonic "$MNEMONIC" \
        --state "$STATE_FILE" \
        --state-interval 60 \
        --prune-history \
        --chain-id 31337 &
else
    echo "Starting fresh Anvil instance"
    anvil \
        --host 0.0.0.0 \
        --port 8545 \
        --accounts 100 \
        --balance 10000 \
        --mnemonic "$MNEMONIC" \
        --state "$STATE_FILE" \
        --state-interval 60 \
        --prune-history \
        --chain-id 31337 &
fi

ANVIL_PID=$!

# Wait for Anvil to be ready
echo "Waiting for Anvil to be ready..."
sleep 5

# Check if contract needs to be deployed
if [ ! -f "$CONTRACT_FILE" ]; then
    echo "Deploying ValazcoToken contract..."
    /app/deploy-contract.sh
fi

echo "Anvil is ready!"
echo "Contract address: $(cat $CONTRACT_FILE 2>/dev/null || echo 'Not deployed')"

# Keep the container running
wait $ANVIL_PID
