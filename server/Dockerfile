# Multi-stage build for smaller production image
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better cache
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --omit=dev

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Set user to non-root
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Command to run
CMD ["node", "index.js"]