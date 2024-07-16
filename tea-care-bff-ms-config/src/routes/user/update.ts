import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  UserSchema,
  UserDoc,
  getTenantByOrigin,
  sanitizeArray,
  ProfileDoc,
  ProfileSchema,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { userValidations } from '../../middlewares/userValidations';
import { OccupationType } from '@teacare/tea-care-bfb-ms-common/build/src/models/care/occupation-type';
import { UserType } from '@teacare/tea-care-bfb-ms-common/build/src/models/config/user-type';

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

    const name = sanitizeHtml(req.body.name) as string;
    const cpf = sanitizeHtml(req.body.cpf) as string;
    const email = sanitizeHtml(req.body.email) as string;
    const phone = sanitizeHtml(req.body.phone) as string;
    const type = sanitizeHtml(req.body.type) as UserType;
    const occupation = sanitizeHtml(req.body.occupation) as OccupationType;
    const profileIds = sanitizeArray(req.body.profiles) as Array<string>;

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
    user.email = email;
    user.type = type;
    user.occupation = occupation;

    const profiles = await mongoWrapper
      .getModel<ProfileDoc>(tenant, 'Profile', ProfileSchema)
      .find({
        _id: {
          $in: [profileIds],
        },
      });

    //TODO rss3 erro
    // user.profiles = profiles;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export { router as updateUserRouter };
