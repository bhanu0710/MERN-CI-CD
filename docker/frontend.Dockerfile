# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app
COPY app/frontend/package.json app/frontend/package-lock.json* ./app/frontend/
RUN cd app/frontend && npm ci
COPY app/frontend ./app/frontend
RUN cd app/frontend && npm run build

FROM nginx:1.27-alpine AS runner
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

