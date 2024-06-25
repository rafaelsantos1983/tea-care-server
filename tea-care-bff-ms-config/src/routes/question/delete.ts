import express, { Request, Response, NextFunction } from 'express';

import {
  sanitizeString,
  validateRequest,
  mongoWrapper,
  QuestionSchema,
  QuestionDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Remover
 */
router.delete(
  '/api/config/questions/:questionId',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const questionId = sanitizeString(req.params.questionId) as string;
      const Question = await mongoWrapper.getModel<QuestionDoc>(
        tenant,
        'Question',
        QuestionSchema
      );
      await Question.deleteMany({
        _id: questionId,
      }).exec();

      res.status(200).json('OK');
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteQuestionRouter };
