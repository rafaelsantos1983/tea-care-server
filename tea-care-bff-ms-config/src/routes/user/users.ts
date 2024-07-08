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
 * Listagem para associação
 */
router.get(
  '/api/users',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const User = await mongoWrapper.getModel<UserDoc>(
        tenant,
        'User',
        UserSchema
      );

      const users = await User.aggregate([
        {
          $project: { cpf: 1, name: 1, _id: 1 },
        },
        { $sort: { name: 1 } },
      ]);

      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

export { router as usersRouter };
