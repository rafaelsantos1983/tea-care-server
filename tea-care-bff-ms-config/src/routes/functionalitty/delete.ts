import express, { NextFunction, Request, Response } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  FunctionalitySchema,
  FunctionalityDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/config/functionalities/:functionalityId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const FunctionalityId = sanitizeString(
        req.params.FunctionalityId
      ) as string;
      const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
        tenant,
        'Functionality',
        FunctionalitySchema
      );
      await Functionality.deleteMany({
        _id: FunctionalityId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteFunctionalityRouter };
