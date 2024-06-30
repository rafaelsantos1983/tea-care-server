import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  createDate,
  PatientSchema,
  PatientDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { patientValidations } from '../../middlewares/patientValidations';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/config/patients/:patientsId',
  validateRequest,
  patientValidations(),
  updatePatient
);

async function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = sanitizeString(req.params.patientId) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);
    const cpf = sanitizeHtml(req.body.cpf);
    const phone = sanitizeHtml(req.body.phone);

    const Patient = await mongoWrapper.getModel<PatientDoc>(
      tenant,
      'Patient',
      PatientSchema
    );

    let patient = await Patient.findOne({
      _id: patientId,
    });
    if (!patient) {
      throw new NotFoundError();
    }

    patient.name = name;
    patient.cpf = cpf;

    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
}

export { router as updatePatientRouter };
