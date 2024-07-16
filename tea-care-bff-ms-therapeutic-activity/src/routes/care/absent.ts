import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  getTenantByOrigin,
  mongoWrapper,
  PatientSchema,
  PatientDoc,
  UserSchema,
  UserDoc,
  CareDoc,
  CareSchema,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Registro de Atendimento Ausente
 */
router.put(
  '/api/therapeutic-activity/cares/absent',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = sanitizeHtml(req.body.patientId) as string;
      const professionalId = sanitizeHtml(req.body.professionalId) as string;

      const tenant: string = getTenantByOrigin(req);

      const Care = await mongoWrapper.getModel<CareDoc>(
        tenant,
        'Care',
        CareSchema
      );

      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      //paciente
      const patient = await Patient.findOne({
        _id: patientId,
      });

      //profissional
      const professional = await Patient.findOne({
        _id: professionalId,
      });

      const care = new Care({
        professional: professional,
        patient: patient,
        initialDate: new Date(),
        finalDate: new Date(),
        absent: true,
      });

      await care.save();

      res.status(201).json('Atendimento registrado.');
    } catch (error) {
      next(error);
    }
  }
);

export { router as absentRouter };
