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

# Create env file
ARG API_URL
ENV VITE_API_URL=${API_URL}

# Build production code
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 80

# Start serve
CMD ["serve", "-s", "dist", "-l", "80"] 