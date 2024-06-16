import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import helmet from 'helmet';
import morgan from 'morgan';

import {
  NotFoundError,
  TokenLanguageDetector,
  authErrorInterceptor,
  errorHandler,
  loggerWrite,
  tenantInterceptor,
} from '@teacare/tea-care-bfb-ms-common';

import { readdirSync } from 'fs';
import i18next from 'i18next';
import i18nextBackend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import { join } from 'path';
import { healthcheckRoutes } from './app.constants';
import { livenessRouter } from './routes/liveness';
import { readinessRouter } from './routes/readiness';

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(json({ limit: '200mb' }));
app.use(cors());

if (process.env.NODE_ENV != 'local') {
  // Define para colocar no LOG as informações de origem: DATA, METHOD, API, ORIGEM
  app.use(morgan('combined', { stream: loggerWrite }));
}

// Autenticação com JWT
app.use(
  jwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ['HS512'],
  }).unless({
    path: healthcheckRoutes,
  })
);

// Middleware para tratar erros na validação do JWT
app.use(authErrorInterceptor);

// Configura idioma com base no Token
const lngDetector = new i18nextMiddleware.LanguageDetector();
lngDetector.addDetector(new TokenLanguageDetector());

// Cria namespaces para cada arquivo de tradução
function getNamespaces(): string[] {
  return readdirSync(join(__dirname, './locales/en')).map((fileName) =>
    fileName.replace('.json', '')
  );
}

// Configuração de Tradução
i18next
  .use(i18nextBackend)
  .use(lngDetector)
  .init({
    preload: ['en', 'es', 'pt-BR'],
    ns: getNamespaces(),
    fallbackLng: 'en',
    backend: {
      loadPath: `./src/locales/{{lng}}/{{ns}}.json`,
      addPath: `./src/locales/{{lng}}/{{ns}}.missing.json`,
    },
    load: 'currentOnly',
    detection: {
      order: ['TokenLanguageDetector'],
      caches: false,
    },
  });

// Middleware de Tradução
app.use(
  i18nextMiddleware.handle(i18next, {
    ignoreRoutes: healthcheckRoutes,
  })
);

// Rotas abertas
app.use(livenessRouter);
app.use(readinessRouter);

// Interceptor que extrai tenant do Token
app.use(tenantInterceptor);

// Endpoints de Negócio

app.all('*', async (req, res) => {
  throw new NotFoundError(req.path);
});

app.use(errorHandler);

export { app };
