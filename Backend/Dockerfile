FROM node:20-slim

# Install required system dependencies and fonts
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    fonts-liberation \
    fonts-dejavu \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY src ./src
COPY assets ./assets

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
