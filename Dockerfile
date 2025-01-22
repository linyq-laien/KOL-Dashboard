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

# Create nginx log directory
RUN mkdir -p /var/log/nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN adduser -D -H -u 1000 -s /sbin/nologin www-data && \
    chown -R www-data:www-data /usr/share/nginx/html /var/log/nginx

# Switch to non-root user
USER www-data

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 