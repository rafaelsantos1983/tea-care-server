import { AnswerWeightDoc } from '@teacare/tea-care-bfb-ms-common';
import { QualificationType } from '@teacare/tea-care-bfb-ms-common';
import { AnswerWeightSchema } from '@teacare/tea-care-bfb-ms-common';
import { mongoWrapper } from '@teacare/tea-care-bfb-ms-common';
import { OccupationType } from '@teacare/tea-care-bfb-ms-common/src/models/care/occupation-type';

module.exports.exec = async (tenant: string) => {
  const AnswerWeight = await mongoWrapper.getModel<AnswerWeightDoc>(
    tenant,
    'AnswerWeight',
    AnswerWeightSchema
  );

  //Comunicação
  let weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.25 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.21 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.18 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.14,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.11 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.07 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightCommunication = new AnswerWeight({
    qualificationType: QualificationType.COMMUNICATION,
    weights: weights,
  });

  await answerWeightCommunication.save();

  //Alimentação
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.21 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.14 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.07 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.18,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.11 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.04 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.25 });

  const answerWeightFood = new AnswerWeight({
    qualificationType: QualificationType.FOOD,
    weights: weights,
  });

  await answerWeightFood.save();

  //Habilidades Sociais
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.21 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.25 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.11 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.14,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.18 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.07 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightSocialSkills = new AnswerWeight({
    qualificationType: QualificationType.SOCIAL_SKILLS,
    weights: weights,
  });

  await answerWeightSocialSkills.save();

  //Comportamento
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.18 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.25 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.11 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.14,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.21 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.07 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightBehavior = new AnswerWeight({
    qualificationType: QualificationType.BEHAVIOR,
    weights: weights,
  });

  await answerWeightBehavior.save();

  //Autonomia e Regulação
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.14 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.21 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.07 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.25,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.18 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.11 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightAutonomySelfRegulation = new AnswerWeight({
    qualificationType: QualificationType.AUTONOMY_SELF_REGULATION,
    weights: weights,
  });

  await answerWeightAutonomySelfRegulation.save();

  //Autonomia e Regulação
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.18 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.07 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.11 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.25,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.14 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.21 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightMotorPracticalSkills = new AnswerWeight({
    qualificationType: QualificationType.MOTOR_PRACTICAL_SKILLS,
    weights: weights,
  });

  await answerWeightMotorPracticalSkills.save();

  //Autonomia e Regulação
  weights = [];
  weights.push({ occupation: OccupationType.SPEECH_THERAPY, value: 0.14 });
  weights.push({ occupation: OccupationType.Psychology, value: 0.18 });
  weights.push({ occupation: OccupationType.PSYCHOPEDAGOGY, value: 0.25 });
  weights.push({
    occupation: OccupationType.OCCUPATIONAL_THERAPY,
    value: 0.11,
  });
  weights.push({ occupation: OccupationType.School_OT, value: 0.21 });
  weights.push({ occupation: OccupationType.Psychomotricity, value: 0.07 });
  weights.push({ occupation: OccupationType.Nutrition, value: 0.04 });

  const answerWeightAcademicSkills = new AnswerWeight({
    qualificationType: QualificationType.ACADEMIC_SKILLS,
    weights: weights,
  });

  await answerWeightAcademicSkills.save();
};
