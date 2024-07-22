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
  CareAnswerDoc,
  CareAnswerSchema,
  UserSchema,
  UserDoc,
  truncCurrency,
  logger,
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

    //Registrar Respostas Calculads
    const CareAnswer = await mongoWrapper.getModel<CareAnswerDoc>(
      tenant,
      'CareAnswer',
      CareAnswerSchema
    );

    //Profissão
    const User = await mongoWrapper.getModel<UserDoc>(
      tenant,
      'User',
      UserSchema
    );

    let professional: any = await User.findOne({ _id: care.professional });

    const DashboardExternal = await mongoWrapper.getModel<DashboardExternalDoc>(
      tenant,
      'DashboardExternal',
      DashboardExternalSchema
    );

    //Limpar os dados para o Dashboard Externo
    await DashboardExternal.deleteMany({
      patient: care.patient,
    }).exec();

    const DashboardInternal = await mongoWrapper.getModel<DashboardInternalDoc>(
      tenant,
      'DashboardInternal',
      DashboardInternalSchema
    );

    //Limpar os dados para o Dashboard Interno
    await DashboardInternal.deleteMany({
      patient: care.patient,
    }).exec();

    const today = new Date();

    //Calculo do Dashboard Externo
    await surver.forEach(async function (item: any) {
      let qualificationType = item.qualificationType as QualificationType;
      let answers = item.answers as Array<string>;

      const answerWeight = await AnswerWeight.aggregate([
        { $unwind: { path: '$weights' } },
        {
          $match: {
            qualificationType: qualificationType,
            'weights.occupation': professional.occupation,
          },
        },
        {
          $project: {
            _id: 0,
            'weights.value': 1,
          },
        },
      ]).exec();

      let answersSum = 0;
      let gradeWeight = answerWeight[0].weights.value;

      await answers.forEach(function (answer: any) {
        answersSum = answersSum + answer * gradeWeight;
      });

      //registra um resposta, com os cálculos dos pesos
      const careAnswer = new CareAnswer({
        patient: care.patient,
        qualificationType: qualificationType,
        year: today.getFullYear(),
        month: today.getMonth(),
        value: Number(truncCurrency(answersSum)),
      });

      await careAnswer.save();
    });

    //Calcular dados do Dashboard Externo
    const dashboardExternalDatas = await CareAnswer.aggregate([
      {
        $match: {
          patient: care.patient._id,
        },
      },
      {
        $group: {
          _id: '$qualificationType',
          pop: { $avg: '$value' },
        },
      },
      {
        $addFields: {
          pop: {
            $toDouble: { $substrBytes: ['$pop', 0, 4] },
          },
        },
      },
    ]).exec();

    logger.debug(`Media ${dashboardExternalDatas}`);

    let ratingExternal: any[] = [];

    await dashboardExternalDatas.forEach(async function (item: any) {
      ratingExternal.push({
        qualificationType: item._id,
        value: item.pop,
      });
    });

    //Adicionar dados do dashboard externo
    const dashboardExternal = new DashboardExternal({
      patient: care.patient,
      rating: ratingExternal,
    });

    await dashboardExternal.save();

    let ratingInternal: any[] = [];

    //Calcular dados do Dashboard Interno
    const dashboardInternalDatas = await CareAnswer.aggregate([
      {
        $match: {
          patient: care.patient._id,
        },
      },
      {
        $group: {
          _id: {
            qualificationType: '$qualificationType',
            year: '$year',
            month: '$month',
          },
          pop: { $avg: '$value' },
        },
      },
      {
        $addFields: {
          pop: {
            $toDouble: { $substrBytes: ['$pop', 0, 4] },
          },
        },
      },
    ]).exec();

    logger.debug(`Media ${dashboardInternalDatas}`);

    //Calculo Dashboard Interno
    await dashboardInternalDatas.forEach(async function (item: any) {
      let months: any[] = [];
      months.push({
        month: item._id.month,
        value: item.pop,
      });

      let periods: any[] = [];

      periods.push({
        year: item._id.year,
        months: months,
      });

      ratingInternal.push({
        qualificationType: item._id.qualificationType,
        periods: periods,
      });
    });

    const dashboardInternal = new DashboardInternal({
      patient: care.patient,
      rating: ratingInternal,
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
