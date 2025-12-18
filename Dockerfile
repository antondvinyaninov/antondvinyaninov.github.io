FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm install

# Build the app
FROM base AS builder

# Установка sharp для оптимизации изображений
RUN apk add --no-cache vips-dev build-base python3

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Оптимизация изображений перед сборкой
RUN npm run optimize:images

# Сборка приложения
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY package*.json ./

# Создаем директорию для данных с правами на запись
RUN mkdir -p /app/data && chmod 777 /app/data

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
