import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { expressjwt as jwt } from 'express-jwt';
import helmet from 'helmet';
import morgan from 'morgan';

import {
  NotFoundError,
  authErrorInterceptor,
  errorHandler,
  loggerWrite,
} from '@teacare/tea-care-bfb-ms-common';

import i18nextMiddleware from 'i18next-http-middleware';
import { healthcheckRoutes } from './app.constants';
import { livenessRouter } from './routes/liveness';
import { readinessRouter } from './routes/readiness';
import { signinRouter } from './routes/auth/signin';
import { signupRouter } from './routes/register/signup';
import { i18n } from './util/i18n';

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(json({ limit: '200mb' }));
app.use(cors());
app.use(express.json());

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

// Middleware de Tradução
app.use(
  i18nextMiddleware.handle(i18n, {
    ignoreRoutes: healthcheckRoutes,
  })
);

// Rotas abertas
app.use(livenessRouter);
app.use(readinessRouter);

// Endpoints de Negócio
app.use(signinRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError(req.path);
});

app.use(errorHandler);

export { app };
