import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  createDate,
  UserSchema,
  UserDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { userValidations } from '../../middlewares/userValidations';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/config/users/:userId',
  validateRequest,
  userValidations(),
  updateUser
);

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = sanitizeString(req.params.userId) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);
    const cpf = sanitizeHtml(req.body.cpf);
    const phone = sanitizeHtml(req.body.phone);

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

    user.name = name;
    user.cpf = cpf;
    user.phone = phone;

    user.updateDate = createDate();

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export { router as updateUserRouter };
