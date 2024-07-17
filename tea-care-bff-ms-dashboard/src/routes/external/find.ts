import express, { Request, Response, NextFunction } from 'express';

import {
  getTenantByOrigin,
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  PatientDoc,
  PatientSchema,
  DashboardExternalDoc,
  DashboardExternalSchema,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Dashboard Externo pelo paciente
 */
router.get(
  '/api/dashboard/external/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = sanitizeString(req.params.patientId) as string;
      const tenant: string = getTenantByOrigin(req);

      const DashboardExternal =
        await mongoWrapper.getModel<DashboardExternalDoc>(
          tenant,
          'DashboardExternal',
          DashboardExternalSchema
        );

      let dashboardExternal = await DashboardExternal.findOne({
        'patient._id': patientId,
      });

      res.status(200).json(dashboardExternal);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findPatientRouter };
