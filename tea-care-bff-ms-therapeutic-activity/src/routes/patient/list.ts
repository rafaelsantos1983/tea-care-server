import express, { Request, Response, NextFunction } from 'express';
import {
  getTenantByOrigin,
  mongoWrapper,
  validateRequest,
  PatientDoc,
  PatientSchema,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/therapeutic-activity/patients',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Patient = mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      const patients = await Patient.find({});

      res.send(patients);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listPatientRouter };
