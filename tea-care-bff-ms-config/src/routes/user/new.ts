import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

import {
  ProfileDoc,
  ProfileSchema,
  generatePassword,
  getTenantByOrigin,
  logger,
  mongoWrapper,
  sanitizeArray,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  UserSchema,
  UserDoc,
} from '@teacare/tea-care-bfb-ms-common';
import { userValidations } from '../../middlewares/userValidations';
import { OccupationType } from '@teacare/tea-care-bfb-ms-common/build/src/models/care-type';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/users',
  userValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const cpf = sanitizeHtml(req.body.cpf) as string;
      const email = sanitizeHtml(req.body.email) as string;
      const phone = sanitizeHtml(req.body.phone) as string;
      const type = sanitizeHtml(req.body.type) as string;
      const occupation = sanitizeHtml(req.body.occupation) as OccupationType;
      const profilesSymbol = sanitizeArray(req.body.profiles) as Array<string>;

      const tenant: string = getTenantByOrigin(req);

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

      //gerar senha
      const newPassword = generatePassword();
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      const profiles = await mongoWrapper
        .getModel<ProfileDoc>(tenant, 'Profile', ProfileSchema)
        .find({
          symbol: {
            $in: [profilesSymbol],
          },
        });

      const user = new User({
        name: name,
        cpf: cpf,
        phone: phone,
        email: email,
        type: type,
        occupation: occupation,
        password: passwordHash,
        profiles: profiles,
      });

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
        to: email,
        subject: 'Bem-vindo ao Tea Care',
        html: `<h2>Olá ${name}!</h2> <p> Senha de acesso ao Tea Care: ${newPassword} </p>`,
        text: `Olá ${name}! Senha de acesso ao Tea Care: ${newPassword}`,
      };

      transport.sendMail(message, (error: any, info: any) => {
        if (error) {
          logger.info(
            `Erro ao enviar e-mail de boas vindas. Mensagem ${error}`
          );
        } else {
          logger.info(
            `Mensagem de boas vindas enviada com sucesso. ${info.response}`
          );
        }
      });

      await user.save();

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newUserRouter };
