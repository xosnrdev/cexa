FROM node:18-alpine

# Install TypeScript and ts-node globally
RUN npm install -g ts-node@10.9.2 typescript@5.3.3

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tell docker that all future commands should run as the appuser user
USER appuser

# Add a healthcheck
HEALTHCHECK --interval=5m --timeout=3s \
  CMD node -e 'require("http").createServer().listen(8080)' || exit 1
