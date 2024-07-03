import express, { Request, Response, NextFunction } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  getTenantByOrigin,
  PatientDoc,
  PatientSchema,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/therapeutic-activity/patients/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const patientId = sanitizeString(req.params.patientId) as string;
      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );
      await Patient.deleteMany({
        _id: patientId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deletePatientRouter };
