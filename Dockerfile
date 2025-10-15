# =========================================
# n8n Dockerfile - Render Compatible Version
# =========================================

# Use the latest stable version of n8n
FROM n8nio/n8n:latest

# Set default environment variables
# NOTE: For production, prefer setting these as secrets in your hosting provider.
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=changeme
ENV N8N_ENCRYPTION_KEY=random_secret_key
ENV WEBHOOK_TUNNEL_URL=https://n8n-jto2.onrender.com
ENV EXECUTIONS_PROCESS=main

# Default n8n port
EXPOSE 5678

# Startup command
CMD ["n8n", "start"]