import express, { Request, Response, NextFunction } from 'express';

import {
  getTenantByOrigin,
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  PatientDoc,
  PatientSchema,
  UserSchema,
  UserDoc,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Usuário Id
 */
router.get(
  '/api/therapeutic-activity/patients/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = sanitizeString(req.params.patientId) as string;
      const tenant: string = getTenantByOrigin(req);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'Patient',
        UserSchema
      );

      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      let patient = await Patient.findOne({
        _id: patientId,
        // }).populate({
        //   path: 'responsible',
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
