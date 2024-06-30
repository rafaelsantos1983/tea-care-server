import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  PatientSchema,
  PatientDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/patients/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = sanitizeString(req.params.PatientId) as string;
      const tenant: string = getTenantByOrigin(req);
      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      let patient = await Patient.findOne({
        _id: patientId,
      });
      if (!Patient) {
        throw new NotFoundError();
      }

      res.status(200).json(Patient);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findPatientRouter };
