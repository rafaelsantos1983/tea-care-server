import express, { Request, Response, NextFunction } from 'express';
import {
  mongoWrapper,
  validateRequest,
  FunctionalitySchema,
  FunctionalityDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/config/functionalityalitties',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
        tenant,
        'Functionality',
        FunctionalitySchema
      );

      const functionalitys = await Functionality.find({});

      res.send(functionalitys);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listFunctionalityRouter };
