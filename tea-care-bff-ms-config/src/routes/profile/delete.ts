import express, { NextFunction, Request, Response } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  ProfileSchema,
  ProfileDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/config/profiles/:profileId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const ProfileId = sanitizeString(req.params.ProfileId) as string;
      const Profile = await mongoWrapper.getModel<ProfileDoc>(
        tenant,
        'Profile',
        ProfileSchema
      );
      await Profile.deleteMany({
        _id: ProfileId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteProfileRouter };
