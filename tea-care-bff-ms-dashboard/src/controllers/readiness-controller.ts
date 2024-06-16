import { Request, Response } from 'express';

import { logger } from '@teacare/tea-care-bfb-ms-common';

async function readinessController(req: Request, res: Response) {
  logger.info('Checking Readiness');
  let readiness = req.app.locals.readiness;
  let code: number = 500;

  if (readiness) {
    code = 200;
  }

  logger.info('[ms-dashboard:readiness] Readiness: ' + readiness);
  res.status(code).json('[ms-dashboard:readiness] readiness: ' + readiness);
}

export { readinessController };
