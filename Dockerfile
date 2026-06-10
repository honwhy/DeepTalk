FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tini

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist/ ./dist/

RUN mkdir -p /app/output /app/contents /app/markdowns

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

VOLUME ["/app/output", "/app/contents", "/app/markdowns"]

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js", "web"]
