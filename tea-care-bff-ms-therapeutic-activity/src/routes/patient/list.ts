import express, { Request, Response, NextFunction } from 'express';
import { mongoWrapper, validateRequest } from '@teacare/tea-care-bfb-ms-common';
import { PatientSchema, PatientDoc } from '../../models/patient';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/therapeutic-activity/patients',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = 'upe';

      const Patient = await mongoWrapper.getModel<PatientDoc>(
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
