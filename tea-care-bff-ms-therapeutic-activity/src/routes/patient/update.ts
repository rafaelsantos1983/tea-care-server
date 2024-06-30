import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  getTenantByOrigin,
  PatientDoc,
  PatientSchema,
} from "@teacare/tea-care-bfb-ms-common";
import express, { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  "/api/therapeutic-activity/patients/:patientId",
  validateRequest,
  updatePatient,
);

async function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = sanitizeString(req.params.PatientId) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);
    const cpf = sanitizeHtml(req.body.cpf);
    const birthday = sanitizeHtml(req.body.birthday);

    const Patient = await mongoWrapper.getModel<PatientDoc>(
      tenant,
      "Patient",
      PatientSchema,
    );

    let patient = await Patient.findOne({
      _id: patientId,
    });
    if (!patient) {
      throw new NotFoundError();
    }

    patient.name = name;
    patient.cpf = cpf;
    patient.birthday = new Date(birthday);

    await patient.save();

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
}

export { router as updatePatientRouter };
