FROM node:21-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS buildStage

COPY . .
RUN npm run build

FROM node:21-alpine AS productionStage

RUN addgroup -S cexa && adduser -S -G cexa cexa

WORKDIR /home/cexa/app
RUN chown -R cexa:cexa /home/cexa/app
USER cexa

COPY --from=buildStage /app/dist /app/package.json ./

RUN npm install --omit=dev --ignore-scripts

EXPOSE 8080
CMD ["npm", "start"]
