# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY app/backend/package.json app/backend/package-lock.json* ./app/backend/
RUN cd app/backend && npm ci

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S node -G nodejs

COPY --from=deps /app/app/backend/node_modules ./app/backend/node_modules
COPY app/backend ./app/backend

EXPOSE 8080
USER node
WORKDIR /app/app/backend
CMD ["node", "src/server.js"]

