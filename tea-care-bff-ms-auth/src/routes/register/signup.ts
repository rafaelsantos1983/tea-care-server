import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  createDate,
  getTenantByOrigin,
  mongoWrapper,
  UserSchema,
  UserDoc,
} from '@teacare/tea-care-bfb-ms-common';

const bcrypt = require('bcrypt');

import {
  validateRequest,
  BadRequestError,
} from '@teacare/tea-care-bfb-ms-common';
import { signupValidations } from '../../middlewares/signupValidations';

const router = express.Router();

/**
 * Registro de Usuário
 */
router.post(
  '/api/signup',
  signupValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const email = sanitizeHtml(req.body.email) as string;
      const password = sanitizeHtml(req.body.password) as string;
      const confirmPassword = sanitizeHtml(req.body.confirmPassword) as string;

      const tenant: string = getTenantByOrigin(req);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      if (password !== confirmPassword) {
        throw new BadRequestError(
          'A senha e a confirmação da senha estão diferentes.'
        );
      }

      // consulta se já existe
      const hasUser = await User.findOne({
        email: email,
      });

      if (hasUser) {
        throw new BadRequestError('Usuário já existe.');
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        password: passwordHash,
        email: email,
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await user.save();

      res.status(201).json('Usuário registrado.');
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };
