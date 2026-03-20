FROM hyperledger/besu:latest

# Copy configuration files
COPY genesis.json /config/genesis.json
COPY config.toml /config/config.toml

# Create data directory
RUN mkdir -p /data

# Expose ports
# 8545 - JSON-RPC HTTP
# 8546 - JSON-RPC WebSocket
# 30303 - P2P (not used in single node mode)
EXPOSE 8545 8546 30303

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8545 -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' || exit 1

# Start Besu in development mode with configuration
# --network=dev enables instant block mining for transactions
ENTRYPOINT ["besu", "--network=dev", "--data-path=/data", "--rpc-http-enabled", "--rpc-http-api=ETH,NET,WEB3,ADMIN,DEBUG,TXPOOL", "--rpc-http-host=0.0.0.0", "--rpc-http-port=8545", "--rpc-http-cors-origins=*", "--rpc-ws-enabled", "--rpc-ws-api=ETH,NET,WEB3", "--rpc-ws-host=0.0.0.0", "--rpc-ws-port=8546", "--host-allowlist=*", "--min-gas-price=0", "--p2p-enabled=false"]
