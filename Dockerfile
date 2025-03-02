# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.3
ARG PNPM_VERSION=10.5.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps as build

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN pnpm run build

################################################################################
# Create a stage for the production image with nginx to serve static files.
FROM nginx:alpine as final

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the build stage to nginx's serving directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Cloud Run requires the container to listen on $PORT
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Use shell form to substitute the PORT environment variable at runtime
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'