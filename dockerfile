# # Build stage
# FROM node:16.6 AS build

# WORKDIR /app

# # Downgrade npm to a compatible version
# RUN npm install -g npm@9

# # Copy package files first for efficient caching
# COPY package.json package-lock.json ./
# RUN npm cache clean --force && npm install --legacy-peer-deps --no-fund --no-audit --force

# # Copy only necessary directories for the build
# COPY src ./src
# COPY public ./public

# RUN npm run build

# # Use a lightweight web server to serve static files
# FROM node:16.6 AS runtime

# WORKDIR /app

# COPY --from=build /app/build /app

# EXPOSE 3000

# CMD ["npx", "serve", "-s", "/app", "-l", "3000"]


# Build stage
FROM node:16.6.2 AS build

WORKDIR /app
RUN npm install -g npm@8

# Copy package files first for caching
COPY package.json package-lock.json ./
RUN npm cache clean --force && npm install --legacy-peer-deps --no-fund --no-audit --force

# Copy all project files
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Run the build process
RUN npm run build

# Runtime stage
FROM node:16.6.2 AS runtime

WORKDIR /app

COPY --from=build /app/build /app

EXPOSE 3000

CMD ["npx", "serve", "-s", "/app", "-l", "3000"]


# sudo docker run -d -p 3000:3000 --name testapp adarshmali/fooderpfrontend:1 .

# sudo docker run -d -p 3000:3000 --name fooderpfrontend adarshmali/fooderpfrontend:1

