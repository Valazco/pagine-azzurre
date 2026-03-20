# Anvil blockchain node for Pagine Azzurre
FROM ghcr.io/foundry-rs/foundry:latest

# Switch to root to create directories and install dependencies
USER root

# Create data directory for persistent state
RUN mkdir -p /data && chmod 777 /data

# Set working directory
WORKDIR /app
RUN chmod 777 /app

# Copy initialization scripts and contract
COPY init.sh /app/init.sh
COPY deploy-contract.sh /app/deploy-contract.sh
COPY ValazcoToken.sol /app/ValazcoToken.sol
COPY foundry.toml /app/foundry.toml

RUN chmod +x /app/init.sh /app/deploy-contract.sh

# Expose RPC port
EXPOSE 8545

# Use a deterministic mnemonic for consistent addresses across restarts
ENV MNEMONIC="test test test test test test test test test test test junk"

# Start Anvil with persistent state
CMD ["/app/init.sh"]
