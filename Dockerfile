# Stage 1: Build the application
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --prod

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Create a minimal production image
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/out ./out

EXPOSE 3000

CMD ["node", "./out/server.js"]