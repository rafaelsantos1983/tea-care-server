import express, { Request, Response, NextFunction } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  UserSchema,
  UserDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/config/patients/:userId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const userId = sanitizeString(req.params.userId) as string;
      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );
      await User.deleteMany({
        _id: userId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteUserRouter };
