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
 * Autenticação
 */
router.post(
  '/api/signin',
  signinValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Recebendo solicitação de login');
      const email = sanitizeHtml(req.body.email) as string;
      const password = sanitizeHtml(req.body.password) as string;
      console.log(`Email: ${email}, Password: ${password}`);

      const tenant: string = getTenantByOrigin(req);
      console.log(`Tenant recuperado: ${tenant}`);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      // Validar usuário
      const hasUser = await User.findOne({ email: email });
      console.log(`Usuário encontrado: ${hasUser}`);

      if (!hasUser) {
        console.log('Usuário não encontrado');
        throw new BadRequestError('Usuário não localizado.');
      }

      // Validar senha
      const validatePassword = await bcrypt.compare(password, hasUser.password);
      console.log(`Senha válida: ${validatePassword}`);

      if (!validatePassword) {
        console.log('Senha inválida');
        throw new BadRequestError('Senha inválida.');
      }

      // Gerar token
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
      console.log(`Token gerado: ${token}`);

      res.status(200).json({ token: token });
    } catch (error) {
      console.error('Erro durante o login:', error);
      next(error);
    }
  }
);

export { router as signinRouter };
