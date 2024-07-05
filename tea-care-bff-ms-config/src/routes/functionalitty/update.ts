import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  FunctionalitySchema,
  FunctionalityDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/config/functionalities/:functionalityId',
  validateRequest,
  updateFunctionality
);

async function updateFunctionality(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const functionalityId = sanitizeString(
      req.params.functionalityId
    ) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);

    const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
      tenant,
      'Functionality',
      FunctionalitySchema
    );

    let functionality = await Functionality.findOne({
      _id: functionalityId,
    });
    if (!functionality) {
      throw new NotFoundError();
    }

    functionality.name = name;

    await functionality.save();

    res.status(200).json(functionality);
  } catch (error) {
    next(error);
  }
}

export { router as updateFunctionalityRouter };
