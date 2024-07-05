import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  UserSchema,
  UserDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/users/:userId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = sanitizeString(req.params.userId) as string;
      const tenant: string = getTenantByOrigin(req);
      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      let user: any = await User.findOne({
        _id: userId,
      });
      if (!user) {
        throw new NotFoundError();
      }

      delete user.password;

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findUserRouter };
