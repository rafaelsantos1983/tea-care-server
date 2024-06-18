import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  createDate,
  FunctionalittySchema,
  FunctionalittyDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/config/functionalitties/:functionalittyId',
  validateRequest,
  updateFunctionalitty
);

async function updateFunctionalitty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const functionalittyId = sanitizeString(
      req.params.functionalittyId
    ) as string;
    const tenant: string = getTenantByOrigin(req);

    const name = sanitizeHtml(req.body.name);

    const Functionalitty = await mongoWrapper.getModel<FunctionalittyDoc>(
      tenant,
      'Functionalitty',
      FunctionalittySchema
    );

    let functionalitty = await Functionalitty.findOne({
      _id: functionalittyId,
    });
    if (!functionalitty) {
      throw new NotFoundError();
    }

    functionalitty.name = name;

    functionalitty.updateDate = createDate();

    await functionalitty.save();

    res.status(200).json(functionalitty);
  } catch (error) {
    next(error);
  }
}

export { router as updateFunctionalittyRouter };
