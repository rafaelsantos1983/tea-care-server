import express, { Request, Response, NextFunction } from 'express';
import {
  mongoWrapper,
  validateRequest,
  QuestionSchema,
  QuestionDoc,
  getTenantByOrigin,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Listar
 */
router.get(
  '/api/config/questions',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant: string = getTenantByOrigin(req);

      const Question = await mongoWrapper.getModel<QuestionDoc>(
        tenant,
        'Question',
        QuestionSchema
      );

      const questions = await Question.find({});

      res.send(questions);
    } catch (error) {
      next(error);
    }
  }
);

export { router as listQuestionRouter };
