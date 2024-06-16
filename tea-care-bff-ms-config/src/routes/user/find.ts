import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
} from '@teacare/tea-care-bfb-ms-common';
import { UserDoc, UserSchema } from '../../models/user';

const router = express.Router();

/**
 * Usuário Id
 */
router.get(
  '/api/config/users/:userId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = sanitizeString(req.params.userId) as string;
      const tenant: string = 'upe';
      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      let user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        throw new NotFoundError();
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findUserRouter };
