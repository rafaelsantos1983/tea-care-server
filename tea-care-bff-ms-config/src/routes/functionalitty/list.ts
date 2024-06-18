import express, { Request, Response, NextFunction } from 'express';
import {
  mongoWrapper,
  validateRequest,
  FunctionalittySchema,
  FunctionalittyDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/config/functionalittyalitties',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Functionalitty = await mongoWrapper.getModel<FunctionalittyDoc>(
        tenant,
        'Functionalitty',
        FunctionalittySchema
      );

      const functionalittys = await Functionalitty.find({});

      res.send(functionalittys);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listFunctionalittyRouter };
