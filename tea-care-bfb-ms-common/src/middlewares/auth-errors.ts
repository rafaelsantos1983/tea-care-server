import { Request, Response, NextFunction } from 'express';
import { logger } from '../util/logger';
export async function authErrorInterceptor(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    logger.error(`[ms-common:auth-errors] ` + err);
    return;
  }
  next();
}
