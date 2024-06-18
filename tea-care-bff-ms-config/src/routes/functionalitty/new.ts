import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  createDate,
  getTenantByOrigin,
  mongoWrapper,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  FunctionalittySchema,
  FunctionalittyDoc,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/functionalittyalitties',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = sanitizeHtml(req.body.name) as string;
      const symbol = sanitizeHtml(req.body.symbol) as string;

      const tenant: string = getTenantByOrigin(req);

      const Functionalitty = await mongoWrapper.getModel<FunctionalittyDoc>(
        tenant,
        'Functionalitty',
        FunctionalittySchema
      );

      // consulta se já existe
      const hasFunctionalitty = await Functionalitty.findOne({
        symbol: symbol,
      });

      if (hasFunctionalitty) {
        throw new BadRequestError('Funcionalidade já existe.');
      }

      const functionalittyalitty = new Functionalitty({
        name: name,
        symbol: symbol,
        creationDate: createDate(),
        updateDate: createDate(),
      });

      await functionalittyalitty.save();

      res.status(201).json(functionalittyalitty);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newFunctionalittyRouter };
