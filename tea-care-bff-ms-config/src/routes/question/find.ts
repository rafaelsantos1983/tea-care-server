import express, { Request, Response, NextFunction } from 'express';

import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  QuestionSchema,
  QuestionDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Consulta pelo Id
 */
router.get(
  '/api/config/questions/:questionId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = sanitizeString(req.params.questionId) as string;
      const tenant: string = getTenantByOrigin(req);
      const Question = await mongoWrapper.getModel<QuestionDoc>(
        tenant,
        'Question',
        QuestionSchema
      );

      let question = await Question.findOne({
        _id: questionId,
      });
      if (!question) {
        throw new NotFoundError();
      }

      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  }
);

export { router as findDeleteRouter };
