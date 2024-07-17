import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  getTenantByOrigin,
  CareDoc,
  CareSchema,
  QualificationType,
  AnswerWeightDoc,
  AnswerWeightSchema,
  DashboardExternalSchema,
  DashboardExternalDoc,
  DashboardInternalSchema,
  DashboardInternalDoc,
} from '@teacare/tea-care-bfb-ms-common';
import { OccupationType } from '@teacare/tea-care-bfb-ms-common/src/models/care/occupation-type';
import { Survey } from '@teacare/tea-care-bfb-ms-common/src/models/care/survey';
import express, { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

/**
 * Atualizar
 */
router.post(
  '/api/therapeutic-activity/cares/:careId',
  validateRequest,
  updateCare
);

async function updateCare(req: Request, res: Response, next: NextFunction) {
  try {
    const careId = sanitizeString(req.params.careId) as string;
    const tenant: string = getTenantByOrigin(req);
    const surver = req.body.surver;

    const Care = await mongoWrapper.getModel<CareDoc>(
      tenant,
      'Care',
      CareSchema
    );

    const AnswerWeight = await mongoWrapper.getModel<AnswerWeightDoc>(
      tenant,
      'AnswerWeight',
      AnswerWeightSchema
    );

    const care = await Care.findOne({
      _id: careId,
    });

    if (!care) {
      throw new NotFoundError();
    }

    //Profissão
    let professionalOccupation = care.professional.occupation;

    let rating: any[] = [];

    //Calculo do Dashboard Externo
    surver.forEach(async function (item: any) {
      let qualificationType = item.qualificationType as QualificationType;
      let answers = item.answers as Array<string>;

      const answerWeight = await AnswerWeight.aggregate([
        { $unwind: { path: '$weights' } },
        {
          $match: {
            qualificationType: qualificationType,
            'weights.occupation': professionalOccupation,
          },
        },
        {
          $project: {
            _id: 0,
            'weights.value': 1,
          },
        },
      ]);

      let answersSum = 0;
      let gradeWeight = answerWeight[0].value;

      answers.forEach(function (answer: any) {
        answersSum = answersSum + answer * gradeWeight;
      });

      rating.push({
        qualtificationType: qualificationType,
        value: answersSum / answers.length,
      });
    });

    const DashboardExternal = await mongoWrapper.getModel<DashboardExternalDoc>(
      tenant,
      'DashboardExternal',
      DashboardExternalSchema
    );

    const dashboardExternal = new DashboardExternal({
      patient: care.patient,
      rating: rating,
    });

    await dashboardExternal.save();

    //Calculo Dashboard Interno
    const DashboardInternal = await mongoWrapper.getModel<DashboardInternalDoc>(
      tenant,
      'DashboardInternal',
      DashboardInternalSchema
    );

    const dashboardInternal = new DashboardInternal({
      patient: care.patient,
      rating: rating,
    });

    await dashboardInternal.save();

    //Atendimento
    care.finalDate = new Date();
    care.tramit = false;

    await care.save();

    res.status(200).json(care);
  } catch (error) {
    next(error);
  }
}

export { router as updateCareRouter };
