# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Bundle app source inside Docker image
COPY . .

# Build the application
RUN npm run build

# Use an official Node.js runtime as a parent image for the production environment
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Bundle app source inside Docker image from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]