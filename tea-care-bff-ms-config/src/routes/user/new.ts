import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import { createDate, mongoWrapper } from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  UserSchema,
  UserDoc,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/users',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const cpf = sanitizeHtml(req.body.cpf) as string;
      const phone = sanitizeHtml(req.body.phone) as string;
      const birthday = sanitizeHtml(req.body.birthday) as string;

      const tenant: string = 'upe';

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      // consulta se já existe
      const hasUser = await User.findOne({
        cpf: cpf,
      });

      if (hasUser) {
        throw new BadRequestError('Usuário já existe.');
      }

      const user = new User({
        name: name,
        cpf: cpf,
        phone: phone,
        birthday: new Date(birthday),
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await user.save();

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newUserRouter };
