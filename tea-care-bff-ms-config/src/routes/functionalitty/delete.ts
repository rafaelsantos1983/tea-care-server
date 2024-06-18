import express, { NextFunction, Request, Response } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  FunctionalittySchema,
  FunctionalittyDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/config/functionalitties/:functionalittyId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const FunctionalittyId = sanitizeString(
        req.params.FunctionalittyId
      ) as string;
      const Functionalitty = await mongoWrapper.getModel<FunctionalittyDoc>(
        tenant,
        'Functionalitty',
        FunctionalittySchema
      );
      await Functionalitty.deleteMany({
        _id: FunctionalittyId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteFunctionalittyRouter };
