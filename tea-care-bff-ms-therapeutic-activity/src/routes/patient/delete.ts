import express, { Request, Response, NextFunction } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

import { PatientDoc, PatientSchema } from '../../models/patient';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/therapeutic-activity/patients/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = 'upe';

      const PatientId = sanitizeString(req.params.PatientId) as string;
      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );
      await Patient.deleteMany({
        _id: PatientId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deletePatientRouter };
