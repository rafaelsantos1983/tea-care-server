import {
  logger,
  mongoWrapper,
  ServiceName,
} from '@teacare/tea-care-bfb-ms-common';

import http = require('http');
import https = require('https');
import { readFileSync } from 'fs';

import { app } from './app';
import { executeScripts } from './database/migrations-service';

app.locals.readiness = false;

let privateKey;
let certificate;
// Carrega o certificado para o HTTPS
try {
  privateKey = readFileSync(`${__dirname}/../../certificate/key.pem`, 'utf8');
  certificate = readFileSync(`${__dirname}/../../certificate/cert.pem`, 'utf8');
} catch (reason) {
  logger.error(
    `[ms-reports:index] Error while trying to get certificate information. Error: ${reason}`
  );
}

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Conexão com o mongoDB

const start = async () => {
  if (!process.env.LOGGER_LEVEL) {
    throw new Error('[ms-reports:index] LOGGER_LEVEL must be defined');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('[ms-reports:index] JWT_SECRET must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('[ms-reports:index] MONGO_URI must be defined');
  }
  if (!process.env.NODE_ENV) {
    throw new Error('[ms-reports:index] NODE_ENV must be defined');
  }
  if (!process.env.PORT) {
    throw new Error('[ms-reports:index] PORT must be defined');
  }
  if (!process.env.TLS_PORT) {
    throw new Error('[ms-reports:index] TLS_PORT must be defined');
  }

  app.locals.logger = logger;

  // Conecta com o banco e cria as conexões dos tenants
  try {
    const tenants = await mongoWrapper.connectToMongo(ServiceName.report);

    if (tenants) {
      logger.info('[ms-reports:index] Executar scripts de ajustes no banco.');
      await executeScripts(tenants);
    }
  } catch (err) {
    logger.error(
      '[ms-reports:index] Erro ao conectar/executar script no Mongo ',
      err
    );
  }

  const httpsServer = https.createServer(credentials, app);
  const tlsPort = process.env.TLS_PORT || 443;
  httpsServer.listen(tlsPort, () => {
    console.log(
      `[ms-reports:index] Analysis Configurator running on port ${tlsPort}`
    );
  });

  const httpServer = http.createServer(app);
  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(
      `[ms-reports:index] Analysis Configurator running on port ${port}`
    );
  });

  app.locals.readiness = true;
};

start();
