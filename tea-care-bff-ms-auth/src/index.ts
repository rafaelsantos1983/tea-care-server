import {
  logger,
  mongoWrapper,
  ServiceName,
} from '@teacare/tea-care-bfb-ms-common';

import http = require('http');
import https = require('https');
import { readFileSync } from 'fs';

import { app } from './app';
import { migrations } from './database/migrations-service';

app.locals.readiness = false;

let privateKey;
let certificate;
// Carrega o certificado para o HTTPS
try {
  privateKey = readFileSync(`${__dirname}/../../certificate/key.pem`, 'utf8');
  certificate = readFileSync(`${__dirname}/../../certificate/cert.pem`, 'utf8');
} catch (reason) {
  logger.error(
    `[ms-therapeutic-activity:index] Error while trying to get certificate information. Error: ${reason}`
  );
}

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Conexão com o mongoDB

const start = async () => {
  if (!process.env.LOGGER_LEVEL) {
    throw new Error(
      '[ms-therapeutic-activity:index] LOGGER_LEVEL must be defined'
    );
  }
  if (!process.env.JWT_SECRET) {
    throw new Error(
      '[ms-therapeutic-activity:index] JWT_SECRET must be defined'
    );
  }
  if (!process.env.MONGO_URI) {
    throw new Error(
      '[ms-therapeutic-activity:index] MONGO_URI must be defined'
    );
  }
  if (!process.env.NODE_ENV) {
    throw new Error('[ms-therapeutic-activity:index] NODE_ENV must be defined');
  }

  app.locals.logger = logger;

  // Conecta com o banco e cria as conexões dos tenants
  try {
    const tenants = await mongoWrapper.connectToMongo(
      ServiceName.therapeuticActivity
    );

    if (tenants) {
      logger.info(
        '[ms-therapeutic-activity:index] Executar scripts de ajustes no banco.'
      );
      await migrations(tenants);
    }
  } catch (err) {
    logger.error(
      '[ms-therapeutic-activity:index] Erro ao conectar/executar script no Mongo ',
      err
    );
  }

  const httpsServer = https.createServer(credentials, app);
  const tlsPort = process.env.TLS_PORT || 443;
  httpsServer.listen(tlsPort, () => {
    console.log(
      `[ms-therapeutic-activity:index] Analysis Configurator running on port ${tlsPort}`
    );
  });

  const httpServer = http.createServer(app);
  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(
      `[ms-therapeutic-activity:index] Analysis Configurator running on port ${port}`
    );
  });

  app.locals.readiness = true;
};

start();
