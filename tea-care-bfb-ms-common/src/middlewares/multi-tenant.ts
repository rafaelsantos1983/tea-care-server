import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../..';
import { mongoWrapper } from '../database/mongo';

export async function tenantInterceptor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const constituent = (req as any).headers?.constituent;

  if (
    constituent &&
    typeof constituent === 'string' &&
    mongoWrapper.hasTenant(constituent)
  ) {
    res.locals.tenant = constituent;
  } else {
    throw new BadRequestError(`Tenant ${constituent} not provided or invalid`);
  }
  next();
}
