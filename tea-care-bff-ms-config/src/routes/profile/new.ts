import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  createDate,
  getTenantByOrigin,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  ProfileSchema,
  ProfileDoc,
} from '@teacare/tea-care-bfb-ms-common';
import { profileValidations } from '../../middlewares/profileValidations';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/profiles',
  profileValidations(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const symbol = sanitizeHtml(req.body.symbol) as string;

      const tenant: string = getTenantByOrigin(req);

      const Profile = await mongoWrapper.getModel<ProfileDoc>(
        tenant,
        'Profile',
        ProfileSchema
      );

      // consulta se já existe
      const hasProfile = await Profile.findOne({
        symbol: symbol,
      });

      if (hasProfile) {
        throw new BadRequestError('Funcionalidade já existe.');
      }

      const profilealitty = new Profile({
        name: name,
        symbol: symbol,
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await profilealitty.save();

      res.status(201).json(profilealitty);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newProfileRouter };
