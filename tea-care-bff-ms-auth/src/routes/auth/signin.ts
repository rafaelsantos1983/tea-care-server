import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  getTenantByOrigin,
  mongoWrapper,
  UserSchema,
  UserDoc,
} from '@teacare/tea-care-bfb-ms-common';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import {
  validateRequest,
  BadRequestError,
} from '@teacare/tea-care-bfb-ms-common';
import { signinValidations } from '../../middlewares/signinValidations';

const router = express.Router();

/**
 * Autenticação ao Aplicativo
 */
router.post(
  '/api/signin',
  signinValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = sanitizeHtml(req.body.email) as string;
      const password = sanitizeHtml(req.body.password) as string;

      const tenant: string = getTenantByOrigin(req);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      // validar usuário
      const hasUser = await User.findOne({
        email: email,
      });

      if (!hasUser) {
        throw new BadRequestError('Usuário não localizado.');
      }

      //validar senha
      const validatePassword = await bcrypt.compare(password, hasUser.password);

      if (!validatePassword) {
        throw new BadRequestError('Senha inválida!');
      }

      //gerar token
      const token = jwt.sign(
        {
          user: {
            id: hasUser._id,
            name: hasUser.name,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: '60m' }
      );

      res.status(200).json({ token: token });
    } catch (error) {
      next(error);
    }
  }
);

export { router as signinRouter };
