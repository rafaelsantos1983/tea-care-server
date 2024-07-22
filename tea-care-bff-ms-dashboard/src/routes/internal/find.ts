import { ObjectId } from 'mongodb';
import express, { Request, Response, NextFunction } from 'express';

import {
  getTenantByOrigin,
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  PatientDoc,
  PatientSchema,
  DashboardInternalDoc,
  DashboardInternalSchema,
  CareAnswerDoc,
  CareAnswerSchema,
  logger,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Dashboard Interno pelo paciente
 */
router.get(
  '/api/dashboard/internal/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = sanitizeString(req.params.patientId) as string;
      const tenant: string = getTenantByOrigin(req);

      const DashboardInternal =
        await mongoWrapper.getModel<DashboardInternalDoc>(
          tenant,
          'DashboardInternal',
          DashboardInternalSchema
        );

      let dashboardInternal = await DashboardInternal.findOne({
        patient: patientId,
      });

      res.status(200).json(dashboardInternal);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findDashboardInternalRouter };
