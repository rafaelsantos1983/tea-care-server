import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  createDate,
  getTenantByOrigin,
  mongoWrapper,
  sanitizeArray,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  PatientSchema,
  PatientDoc,
} from '@teacare/tea-care-bfb-ms-common';
import { patientValidations } from '../../middlewares/patientValidations';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/patients',
  patientValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const cpf = sanitizeHtml(req.body.cpf) as string;
      const phone = sanitizeHtml(req.body.phone) as string;
      const patient = sanitizeArray(req.body.patient);

      const tenant: string = getTenantByOrigin(req);

      const Patient = await mongoWrapper.getModel<PatientDoc>(
        tenant,
        'Patient',
        PatientSchema
      );

      // consulta se já existe
      const hasPatient = await Patient.findOne({
        cpf: cpf,
      });

      if (hasPatient) {
        throw new BadRequestError('Paciente já existe.');
      }

      const patients = new Patient({
        name: name,
        cpf: cpf,
        phone: phone,
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await patients.save();

      res.status(201).json(patients);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newPatientRouter };
