import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  getTenantByOrigin,
  PatientDoc,
  PatientSchema,
  UserSchema,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/therapeutic-activity/patients/:patientId',
  validateRequest,
  updatePatient
);

async function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = sanitizeString(req.params.patientId) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name) as string;
    const cpf = sanitizeHtml(req.body.cpf) as string;
    const birthday = sanitizeHtml(req.body.birthday) as string;
    const responsibleId = sanitizeHtml(req.body.responsibleId) as string;

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

    const responsible = await User.findOne({
      _id: responsibleId,
    })

    const patient = await Patient.findOne({
      _id: patientId,
    });

    if (!patient) {
      throw new NotFoundError();
    }

    patient.name = name;
    patient.cpf = cpf;
    patient.birthday = new Date(birthday);
    patient.responsible = responsible;

    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
}

export { router as updatePatientRouter };
