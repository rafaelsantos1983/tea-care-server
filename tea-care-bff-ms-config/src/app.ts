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

import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import { healthcheckRoutes } from './app.constants';
import { livenessRouter } from './routes/liveness';
import { readinessRouter } from './routes/readiness';
import { i18n } from './util/i18n';
import { newUserRouter } from './routes/user/new';
import { deleteUserRouter } from './routes/user/delete';
import { updateUserRouter } from './routes/user/update';
import { findUserRouter } from './routes/user/find';
import { listUserRouter } from './routes/user/list';
import { deleteProfileRouter } from './routes/profile/delete';
import { findFunctionRouter } from './routes/profile/find';
import { newProfileRouter } from './routes/profile/new';
import { updateProfileRouter } from './routes/profile/update';
import { listProfileRouter } from './routes/profile/list';
import { usersRouter } from './routes/user/users';
import { profilesRouter } from './routes/profile/profiles';

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
//TODO rss comentário até a conclusão do envio do JWT pelo front
// app.use(
//   jwt({
//     secret: process.env.JWT_SECRET as string,
//     algorithms: ['HS512'],
//   }).unless({
//     path: healthcheckRoutes,
//   })
// );

// Middleware para tratar erros na validação do JWT
//TODO rss comentário até a conclusão do envio do JWT pelo front
// app.use(authErrorInterceptor);

// Middleware de Tradução
//TODO rss comentário até a conclusão do envio do JWT pelo front
// app.use(
//   i18nextMiddleware.handle(i18next, {
//     ignoreRoutes: healthcheckRoutes,
//   })
// );

// Rotas abertas
app.use(livenessRouter);
app.use(readinessRouter);

app.use(newUserRouter);
app.use(deleteUserRouter);
app.use(updateUserRouter);
app.use(findUserRouter);
app.use(listUserRouter);

app.use(listProfileRouter);
app.use(newProfileRouter);
app.use(deleteProfileRouter);
app.use(findFunctionRouter);
app.use(updateProfileRouter);

app.use(usersRouter);
app.use(profilesRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError(req.path);
});

app.use(errorHandler);

export { app };
