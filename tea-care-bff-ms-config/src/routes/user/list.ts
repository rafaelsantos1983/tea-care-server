import express, { Request, Response, NextFunction } from 'express';
import {
  mongoWrapper,
  validateRequest,
  UserSchema,
  UserDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/config/users',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      const users: any = await User.aggregate([
        {
          $project: { name: 1, cpf: 1, _id: 1 },
        },
        { $sort: { name: 1 } },
      ]);

      delete users.password;

      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listUserRouter };
