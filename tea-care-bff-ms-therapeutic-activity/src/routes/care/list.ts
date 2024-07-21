import express, { Request, Response, NextFunction } from 'express';
import {
  CareDoc,
  CareSchema,
  getTenantByOrigin,
  mongoWrapper,
  validateRequest,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/therapeutic-activity/cares',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Care = mongoWrapper.getModel<CareDoc>(tenant, 'Care', CareSchema);

      const cares = await Care.find({}).populate({
        path: 'patient',
      });

      res.send(cares);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listCareRouter };
