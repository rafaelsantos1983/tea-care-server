import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
} from '@teacare/tea-care-bfb-ms-common';
import { PatientDoc, PatientSchema } from '../../models/patient';

const router = express.Router();

/**
 * Usuário Id
 */
router.get(
  '/api/therapeutic-activity/patients/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const PatientId = sanitizeString(req.params.PatientId) as string;
      const tenant: string = 'upe';
      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      let patient = await Patient.findOne({
        _id: PatientId,
      });
      if (!patient) {
        throw new NotFoundError();
      }

      res.status(200).json(patient);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findPatientRouter };
