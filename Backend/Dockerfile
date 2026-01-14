FROM node:20-slim

# Install runtime dependencies for canvas and fonts
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libjpeg62-turbo \
    libpango1.0-0 \
    libgif7 \
    libpixman-1-0 \
    fonts-liberation \
    fonts-dejavu \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files (includes package-lock.json for reproducible builds)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src ./src
COPY assets ./assets

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
