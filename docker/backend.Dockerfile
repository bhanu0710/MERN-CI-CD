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

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "src/server.js"]
