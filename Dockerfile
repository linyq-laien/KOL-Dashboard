# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production code
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for debugging
RUN apk add --no-cache curl

# Create nginx log directory
RUN mkdir -p /var/log/nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix permissions
RUN chmod -R 755 /var/log/nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx with proper permissions
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;' & nginx -t && exec nginx -g 'daemon off;'"] 