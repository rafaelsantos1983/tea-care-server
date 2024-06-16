import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  createDate,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { UserDoc, UserSchema } from '../../models/user';

const router = express.Router();

/**
 * Atualizar
 */
router.post('/api/config/users/:userId', validateRequest, updateUser);

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = sanitizeString(req.params.userId) as string;
    const tenant: string = 'upe';

    const name = sanitizeHtml(req.body.name);
    const cpf = sanitizeHtml(req.body.cpf);

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

    user.updateDate = createDate();

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export { router as updateUserRouter };
