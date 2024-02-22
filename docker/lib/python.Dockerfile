FROM python:3.8-alpine

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tell docker that all future commands should run as the appuser user
USER appuser

# Add a healthcheck
HEALTHCHECK --interval=5m --timeout=3s \
  CMD python -c 'import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.bind(("127.0.0.1", 8080)); s.listen(1)' || exit 1
