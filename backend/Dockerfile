# BASE
FROM node:20-alpine AS base
WORKDIR /app

# DEPENCEIES
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

# PRISMA
RUN npx prisma generate

# CODE

COPY . .

EXPOSE 3000

# START
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]