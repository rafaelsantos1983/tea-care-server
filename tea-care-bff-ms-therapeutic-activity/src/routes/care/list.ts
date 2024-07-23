import { ObjectId } from 'mongodb';
import express, { Request, Response, NextFunction } from 'express';
import {
  CareDoc,
  CareSchema,
  PatientDoc,
  PatientSchema,
  UserDoc,
  UserSchema,
  getTenantByOrigin,
  mongoWrapper,
  sanitizeString,
  validateRequest,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/therapeutic-activity/cares/patient/:patientId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);
      const patientId = sanitizeString(req.params.patientId) as string;

      const User = mongoWrapper.getModel<UserDoc>(tenant, 'User', UserSchema);

      const Care = mongoWrapper.getModel<CareDoc>(tenant, 'Care', CareSchema);

      const cares = await Care.find({
        patient: new ObjectId(patientId),
      }).populate({
        path: 'professional',
      });

      res.send(cares);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listCareRouter };
