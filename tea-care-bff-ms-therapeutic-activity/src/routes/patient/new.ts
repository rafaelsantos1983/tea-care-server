import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  getTenantByOrigin,
  mongoWrapper,
  PatientSchema,
  PatientDoc,
  UserSchema,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Registro de Paciente
 */
router.post(
  '/api/therapeutic-activity/patients',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const cpf = sanitizeHtml(req.body.cpf) as string;
      const birthday = sanitizeHtml(req.body.birthday) as string;
      const responsibleId = sanitizeHtml(req.body.responsibleId) as string;

      const tenant: string = getTenantByOrigin(req);

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

      // consulta se já existe
      const hasPatient = await Patient.findOne({
        cpf: cpf,
      });

      const responsible = await User.findOne({
        _id: responsibleId,
      })

      if (hasPatient) {
        throw new BadRequestError('Paciente já existe.');
      }

      const user = new Patient({
        name: name,
        cpf: cpf,
        birthday: birthday,
        responsible: responsible
      });

      await user.save();

      res.status(201).json('Paciente registrado.');
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };
