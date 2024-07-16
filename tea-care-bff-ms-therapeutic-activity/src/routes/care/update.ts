import {
  mongoWrapper,
  NotFoundError,
  sanitizeString,
  validateRequest,
  getTenantByOrigin,
  CareDoc,
  CareSchema,
  UserSchema,
  sanitizeArray,
  QualificationType,
  AnswerWeightDoc,
  AnswerWeightSchema,
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

    // qualitications: [
    //   qualtificationType: QualificationType,
    //   weights: [occupation: OccupationType, value: number],
    // ];

    // AnswerWeight.find;

    //Calculo do Dashboard
    surver.forEach(async function (item: any) {
      let qualificationType = item.qualificationType as QualificationType;
      let answers = item.answers as Array<string>;

      const answerWeight = await AnswerWeight.aggregate([
        {
          $match: {
            qualificationType: qualificationType,
          },
        },
        {
          $addFields: {
            resultApprovers: {
              $first: '$results.resultApprovers.userEvaluatorId',
            },
          },
        },
        { $addFields: { userEvaluatorId: { $first: '$resultApprovers' } } },
        {
          $project: {
            _id: 0,
            analysisObjectId: '$analysisObject.id',
            userEvaluatorId: 1,
          },
        },
      ])
        .aggregate([
          {
            $match: {
              instance: 'EXPENSE_REPORT',
            },
          },
          {
            $addFields: {
              resultApprovers: {
                $first: '$results.resultApprovers.userEvaluatorId',
              },
            },
          },
          { $addFields: { userEvaluatorId: { $first: '$resultApprovers' } } },
          {
            $project: {
              _id: 0,
              analysisObjectId: '$analysisObject.id',
              userEvaluatorId: 1,
            },
          },
        ])

        .aggregate([
          {
            $project: { name: 1, _id: 1 },
          },
          { $sort: { name: 1 } },
        ]);

      // let answerWeight = AnswerWeight.findOne({
      //   qualificationType: qualificationType,
      // });

      let answersSum = 0;
      let gradeWeight = 0;

      // //fonoaudiologia
      // if (professionalOccupation === OccupationType.SPEECH_THERAPY) {
      //   gradeWeight = 0.25;
      // }
      // //Psicologia
      // if (professionalOccupation === OccupationType.Psychology) {
      //   gradeWeight = 0.21;
      // }
      // //psicopedagogia
      // if (professionalOccupation === OccupationType.PSYCHOPEDAGOGY) {
      //   gradeWeight = 0.18;
      // }
      // //terapia ocupacional
      // if (professionalOccupation === OccupationType.OCCUPATIONAL_THERAPY) {
      //   gradeWeight = 0.14;
      // }

      // //AT Escolar
      // if (professionalOccupation === OccupationType.School_OT) {
      //   gradeWeight = 0.11;
      // }

      // //Psicomotricidade
      // if (professionalOccupation === OccupationType.Psychomotricity) {
      //   gradeWeight = 0.07;
      // }

      // //Nutrição
      // if (professionalOccupation === OccupationType.Nutrition) {
      //   gradeWeight = 0.04;
      // }

      answers.forEach(function (answer: any) {
        answersSum = answersSum + answer * gradeWeight;
      });
    });

    //Fonoaudiologia

    //Psicologia

    //Psicopedagogia

    //Terapia Ocupacional

    //AT Escolar

    //Psicomotricidade

    //Nutrição

    care.finalDate = new Date();
    care.tramit = false;

    await care.save();

    res.status(200).json(care);
  } catch (error) {
    next(error);
  }
}

export { router as updateCareRouter };
