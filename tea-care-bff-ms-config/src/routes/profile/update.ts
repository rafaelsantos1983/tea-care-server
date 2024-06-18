import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  createDate,
  ProfileSchema,
  ProfileDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { profileValidations } from '../../middlewares/profileValidations';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/config/profiles/:profileId',
  validateRequest,
  profileValidations(),
  updateProfile
);

async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profileId = sanitizeString(req.params.profileId) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);

    const Profile = await mongoWrapper.getModel<ProfileDoc>(
      tenant,
      'Profile',
      ProfileSchema
    );

    let profile = await Profile.findOne({
      _id: profileId,
    });
    if (!profile) {
      throw new NotFoundError();
    }

    profile.name = name;

    profile.updateDate = createDate();

    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

export { router as updateProfileRouter };
