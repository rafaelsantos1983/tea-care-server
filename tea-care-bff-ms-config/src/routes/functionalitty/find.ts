import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  FunctionalitySchema,
  FunctionalityDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/functionalities/:functionalityId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const functionalityId = sanitizeString(
        req.params.functionalityId
      ) as string;
      const tenant: string = getTenantByOrigin(req);
      const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
        tenant,
        'Functionality',
        FunctionalitySchema
      );

      let functionality = await Functionality.findOne({
        _id: functionalityId,
      });
      if (!functionality) {
        throw new NotFoundError();
      }

      res.status(200).json(functionality);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findFunctionRouter };
