import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
const nodemailer = require('nodemailer');

import {
  getTenantByOrigin,
  mongoWrapper,
  UserSchema,
  UserDoc,
  logger,
  generatePassword,
} from '@teacare/tea-care-bfb-ms-common';

const bcrypt = require('bcrypt');

import { validateRequest } from '@teacare/tea-care-bfb-ms-common';
import { recoverPasswordValidations } from '../../middlewares/recoverPasswordValidations';

const router = express.Router();

/**
 * Recuperar senha
 */
router.post(
  '/api/recover-password',
  recoverPasswordValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = sanitizeHtml(req.body.email) as string;

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

      //só realiza o envio do e-mail e resetar a senha, se localizar o usuário
      if (hasUser) {
        const newPassword = generatePassword();

        const transport = nodemailer.createTransport({
          service: 'Gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        const message = {
          from: `Tea Care <${process.env.MAIL_USERNAME}>`,
          to: hasUser?.email,
          subject: 'Recuperação de senha do Tea Care',
          html: `<h2>Olá ${hasUser?.name}!</h2> <p> Nova senha para utilizar o Tea Care: ${newPassword} </p>`,
          text: `Olá ${hasUser?.name}! Nova senha para utilizar o Tea Care: ${newPassword}`,
        };

        transport.sendMail(message, (error: any, info: any) => {
          if (error) {
            logger.info(`Erro ao enviar e-mail da senha. Mensagem ${error}`);
          } else {
            logger.info(`Mensagem enviada com sucesso. ${info.response}`);
          }
        });

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        hasUser.password = passwordHash;

        await hasUser.save();
      }

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as recoverPasswordRouter };
