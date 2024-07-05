import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  getTenantByOrigin,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  FunctionalitySchema,
  FunctionalityDoc,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/functionalityalitties',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const symbol = sanitizeHtml(req.body.symbol) as string;

      const tenant: string = getTenantByOrigin(req);

      const Functionality = await mongoWrapper.getModel<FunctionalityDoc>(
        tenant,
        'Functionality',
        FunctionalitySchema
      );

      // consulta se já existe
      const hasFunctionality = await Functionality.findOne({
        symbol: symbol,
      });

      if (hasFunctionality) {
        throw new BadRequestError('Funcionalidade já existe.');
      }

      const functionalityalitty = new Functionality({
        name: name,
        symbol: symbol,
      });

      await functionalityalitty.save();

      res.status(201).json(functionalityalitty);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newFunctionalityRouter };
