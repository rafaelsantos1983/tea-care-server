FROM node:20.14.0-alpine

RUN apk add --no-cache tzdata

#Configurar TimeZone - Recife
ENV TZ=America/Recife
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /tea-care-bfb-ms-common
COPY tea-care-bfb-ms-common/package*.json ./
RUN npm install && npm cache clean --force
COPY tea-care-bfb-ms-common .
RUN npm run build

WORKDIR /certificate
COPY certificate .

WORKDIR /app
COPY tea-care-bff-ms-therapeutic-activity/package*.json ./
RUN npm ci
COPY tea-care-bff-ms-therapeutic-activity .
RUN npm install -g typescript
RUN npm run build
COPY tea-care-bff-ms-therapeutic-activity/src/locales ./build/locales
COPY tea-care-bff-ms-therapeutic-activity/src/database/migrationLog.json ./build/database/migrationLog.json
RUN npm ci --only=production

RUN npm i -g npm@latest

CMD ["npm", "start"]