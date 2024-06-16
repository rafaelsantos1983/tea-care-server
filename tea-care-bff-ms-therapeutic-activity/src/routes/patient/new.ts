import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import { createDate, mongoWrapper } from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
} from '@teacare/tea-care-bfb-ms-common';
import { PatientSchema, PatientDoc } from '../../models/patient';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/therapeutic-activity/patients',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const cpf = sanitizeHtml(req.body.cpf) as string;
      const phone = sanitizeHtml(req.body.phone) as string;
      const birthday = sanitizeHtml(req.body.birthday) as string;

      const tenant: string = 'upe';

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
        throw new BadRequestError('Usuário já existe.');
      }

      const patient = new Patient({
        name: name,
        cpf: cpf,
        phone: phone,
        birthday: new Date(birthday),
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await patient.save();

      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newPatientRouter };
