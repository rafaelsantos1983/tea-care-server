import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  FunctionalittySchema,
  FunctionalittyDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/functionalitties/:functionalittyId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const functionalittyId = sanitizeString(
        req.params.functionalittyId
      ) as string;
      const tenant: string = getTenantByOrigin(req);
      const Functionalitty = await mongoWrapper.getModel<FunctionalittyDoc>(
        tenant,
        'Functionalitty',
        FunctionalittySchema
      );

      let functionalitty = await Functionalitty.findOne({
        _id: functionalittyId,
      });
      if (!functionalitty) {
        throw new NotFoundError();
      }

      res.status(200).json(functionalitty);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findFunctionRouter };
