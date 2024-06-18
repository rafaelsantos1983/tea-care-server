import express, { Request, Response, NextFunction } from 'express';
import {
  mongoWrapper,
  validateRequest,
  ProfileSchema,
  ProfileDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/config/profiles',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Profile = await mongoWrapper.getModel<ProfileDoc>(
        tenant,
        'Profile',
        ProfileSchema
      );

      const profiles = await Profile.find({});

      res.send(profiles);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listProfileRouter };
