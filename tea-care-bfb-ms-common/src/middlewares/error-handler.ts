import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';
import { logger } from '../util/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', 1);
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  logger.error(`[ms-common:error-handler] ${err} : ${err.stack}`);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }
  res.status(400).json({
    errors: [
      {
        message: 'Oops... houve um erro na sua solicitação.',
      },
    ],
  });
};
