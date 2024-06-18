import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  ProfileSchema,
  ProfileDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/profiles/:profileId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profileId = sanitizeString(req.params.profileId) as string;
      const tenant: string = getTenantByOrigin(req);
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

      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findFunctionRouter };
