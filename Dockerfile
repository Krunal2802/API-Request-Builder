# Multi-stage Dockerfile for Render deployment
# Stage 1: Build frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Setup backend with frontend assets
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-build /app/frontend/dist ./static

# Create a simple static file server alongside FastAPI
RUN pip install --no-cache-dir aiofiles

# Expose port (Render will set PORT environment variable)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/ || exit 1

# Start command
CMD uvicorn main:app --host 0.0.0.0 --port $PORT