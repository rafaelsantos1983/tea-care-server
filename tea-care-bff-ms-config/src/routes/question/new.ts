import express, { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

import {
  createDate,
  getTenantByOrigin,
  mongoWrapper,
  sanitizeArray,
} from '@teacare/tea-care-bfb-ms-common';

import {
  validateRequest,
  BadRequestError,
  QuestionSchema,
  QuestionDoc,
} from '@teacare/tea-care-bfb-ms-common';

const router = express.Router();

/**
 * Criar
 */
router.put(
  '/api/config/questions',
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const title = sanitizeHtml(req.body.title) as string;
      const body = sanitizeHtml(req.body.body) as string;

      const tenant: string = getTenantByOrigin(req);

      const Question = await mongoWrapper.getModel<QuestionDoc>(
        tenant,
        'Question',
        QuestionSchema
      );

      const question = new Question({
        title: title,
        body: body,
      });

      await question.save();

      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newQuestionRouter };
